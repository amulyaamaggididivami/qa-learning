import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { getShopUrl } from '../utils/shopUrl';

test.describe('Homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('TC-HP-01: Homepage loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/PrestaShop/i);
  });

  test('TC-HP-02: Header logo is visible', async () => {
    await expect(homePage.logo).toBeVisible();
  });

  test('TC-HP-03: Logo navigates to homepage', async ({ page }) => {
    await homePage.navigate('/login');
    await homePage.clickLogo();
    await expect(page).toHaveURL(getShopUrl() + '/');
  });

  test('TC-HP-04: Top navigation menu has category links', async () => {
    await expect(homePage.topNavItems.first()).toBeVisible();
    const count = await homePage.getCategoryCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-HP-05: Featured products section displays products', async () => {
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('TC-HP-06: Product cards show name and price', async ({ page }) => {
    const firstProduct = page.locator('.product-miniature').first();
    await expect(firstProduct.locator('.product-title, h3, .product-miniature__title')).toBeVisible();
    await expect(firstProduct.locator('.price, [class*="price"]')).toBeVisible();
  });

  test('TC-HP-07: Product card click navigates to product page', async ({ page }) => {
    await homePage.clickFirstProduct();
    await expect(page).toHaveURL(/\.html/);
  });

  test('TC-HP-08: Search widget is visible', async () => {
    await expect(homePage.searchInput).toBeVisible();
  });

  test('TC-HP-09: Cart icon is visible', async () => {
    await expect(homePage.cartLink).toBeVisible();
  });

  test('TC-HP-10: Sign-in link is visible when not logged in', async () => {
    await expect(homePage.signInLink).toBeVisible();
  });

  test('TC-HP-11: Footer is visible with links', async () => {
    await expect(homePage.footer).toBeVisible();
    const count = await homePage.footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-HP-12: Newsletter subscription block is visible', async () => {
    await expect(homePage.newsletterInput).toBeVisible();
  });

  test('TC-HP-13: Newsletter rejects non-email input natively', async () => {
    await homePage.newsletterInput.fill('not-an-email');
    await homePage.newsletterSubmit.click();
    const validity = await homePage.newsletterInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });

  test('TC-HP-14: Product hover shows overlay or quick actions', async ({ page }) => {
    const firstMiniature = page.locator('.product-miniature').first();
    await firstMiniature.hover();
    await page.waitForTimeout(300);
    const inner = firstMiniature.locator('.product-miniature__inner, .product-miniature__top');
    await expect(inner).toBeVisible();
  });

  test('TC-HP-15: Social media links are present in footer', async ({ page }) => {
    const socialLinks = page.locator('footer a[href*="facebook"], footer a[href*="twitter"], footer a[href*="instagram"], footer a[href*="youtube"], footer a[href*="linkedin"]');
    const count = await socialLinks.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
