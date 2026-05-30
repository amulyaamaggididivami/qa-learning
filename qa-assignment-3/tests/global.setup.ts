import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const SHOP_URL_FILE = resolve(__dirname, '../.shopurl');
const AUTH_DIR = resolve(__dirname, '../.auth');
const AUTH_FILE = resolve(AUTH_DIR, 'customer.json');

async function globalSetup() {
  console.log('\n[Setup] Provisioning PrestaShop demo...');
  const browser = await chromium.launch({ headless: true });

  // 1. Resolve the dynamic demo shop URL
  const provPage = await browser.newPage();
  await provPage.goto('https://demo.prestashop.com/#/en/front', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });

  let shopBase = '';
  for (let i = 0; i < 40; i++) {
    const srcs: string[] = await provPage.evaluate(() =>
      Array.from(document.querySelectorAll('iframe'))
        .map((e) => (e as HTMLIFrameElement).src)
        .filter((s) => s && !s.includes('doubleclick') && !s.includes('google') && s !== '')
    );
    if (srcs.length > 0) {
      shopBase = new URL(srcs[0]).origin;
      break;
    }
    await provPage.waitForTimeout(2000);
  }
  await provPage.close();

  if (!shopBase) {
    await browser.close();
    throw new Error('[Setup] Could not provision PrestaShop demo after 80 seconds');
  }

  writeFileSync(SHOP_URL_FILE, shopBase, 'utf-8');
  process.env.SHOP_BASE_URL = shopBase;
  console.log(`[Setup] Shop ready at: ${shopBase}`);

  // 2. Log in once and save auth cookies so tests skip the login UI
  mkdirSync(AUTH_DIR, { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const loginPage = await context.newPage();

  try {
    console.log('[Setup] Logging in to save auth state...');
    // Use back param so PS8 redirects to /my-account after login
    await loginPage.goto(shopBase + '/login?back=%2Fmy-account', { waitUntil: 'load', timeout: 30000 });
    await loginPage.fill('#field-email', 'pub@prestashop.com');
    await loginPage.fill('#field-password', '123456789');
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const navDone = loginPage.waitForNavigation({ waitUntil: 'load', timeout: 45000 }).catch(() => {});
    await loginPage.click('#login-form button[type="submit"]', { noWaitAfter: true });
    await navDone;
    // Verify we landed on /my-account (login succeeded)
    if (!loginPage.url().includes('my-account')) {
      // Try direct navigation to /my-account — if session cookie was set, it will work
      await loginPage.goto(shopBase + '/my-account', { waitUntil: 'load', timeout: 15000 }).catch(() => {});
    }
    if (loginPage.url().includes('my-account')) {
      await context.storageState({ path: AUTH_FILE });
      console.log('[Setup] Auth state saved.');
    } else {
      throw new Error('Login failed — could not reach /my-account');
    }
  } catch (e) {
    console.warn('[Setup] Auth state could not be saved:', (e as Error).message);
    // Write empty state so storageState option doesn't crash tests
    writeFileSync(AUTH_FILE, JSON.stringify({ cookies: [], origins: [] }), 'utf-8');
  }

  await browser.close();
}

export default globalSetup;
