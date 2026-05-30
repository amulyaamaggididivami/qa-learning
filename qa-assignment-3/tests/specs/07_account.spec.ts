import { test, expect } from '@playwright/test';
import { resolve } from 'path';
import { AccountPage } from '../pages/AccountPage';
import { CREDENTIALS } from '../data/testData';

// Use pre-authenticated state saved in global setup — avoids slow login UI per test
test.use({ storageState: resolve(__dirname, '../../.auth/customer.json') });

test.describe('My Account', () => {
  let accountPage: AccountPage;

  test.beforeEach(async ({ page }) => {
    accountPage = new AccountPage(page);
    await accountPage.goto();
    // If auth expired, the page redirects to /login — tests will fail asserting /my-account
  });

  test('TC-ACC-01: My Account page URL is correct after login', async ({ page }) => {
    expect(page.url()).toContain('my-account');
  });

  test('TC-ACC-02: Account page shows a heading', async () => {
    await expect(accountPage.pageHeading).toBeVisible();
  });

  test('TC-ACC-03: Account page has navigation links', async ({ page }) => {
    const links = page.locator('a[href*="order"], a[href*="address"], a[href*="identity"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-ACC-04: Order history link is visible', async () => {
    await expect(accountPage.ordersLink).toBeVisible();
  });

  test('TC-ACC-05: Order History page loads', async ({ page }) => {
    await accountPage.goToOrders();
    await expect(page).toHaveURL(/order/);
  });

  test('TC-ACC-06: Order history shows table or empty-state message', async ({ page }) => {
    await accountPage.goToOrders();
    const table = page.locator('table, .orders-table, #order-list');
    const emptyMsg = page.locator('.alert-info, p:has-text("no order"), p:has-text("You have no orders")');
    const hasTable = await table.isVisible().catch(() => false);
    const hasEmpty = await emptyMsg.isVisible().catch(() => false);
    expect(hasTable || hasEmpty).toBeTruthy();
  });

  test('TC-ACC-07: Addresses link is visible', async () => {
    await expect(accountPage.addressesLink).toBeVisible();
  });

  test('TC-ACC-08: Addresses page loads', async ({ page }) => {
    await accountPage.goToAddresses();
    await expect(page).toHaveURL(/address/);
  });

  test('TC-ACC-09: Addresses page has add-address button or existing addresses', async ({ page }) => {
    await accountPage.goToAddresses();
    const addBtn = page.locator('a:has-text("Add"), a[href*="address&create"]');
    const existing = page.locator('article.address, .address-item');
    const hasAdd = await addBtn.isVisible().catch(() => false);
    const hasExisting = (await existing.count()) > 0;
    expect(hasAdd || hasExisting).toBeTruthy();
  });

  test('TC-ACC-10: Personal information link is visible', async () => {
    await expect(accountPage.personalInfoLink).toBeVisible();
  });

  test('TC-ACC-11: Personal information page shows editable form', async ({ page }) => {
    await accountPage.goToPersonalInfo();
    await expect(page).toHaveURL(/identity/);
    await expect(accountPage.firstNameInput).toBeVisible();
    await expect(accountPage.lastNameInput).toBeVisible();
  });

  test('TC-ACC-12: Personal info email field is pre-filled', async () => {
    await accountPage.goToPersonalInfo();
    const email = await accountPage.emailInput.inputValue();
    expect(email).toBe(CREDENTIALS.valid.email);
  });

  test('TC-ACC-13: Breadcrumb is visible on account pages', async () => {
    await expect(accountPage.breadcrumb).toBeVisible();
  });

  test('TC-ACC-14: Sign out works from account page', async ({ page }) => {
    await accountPage.signOut();
    await expect(page).toHaveURL(/login|\/$|\/$/);
    await expect(page.locator('a[href*="login"]').first()).toBeVisible();
  });

  test('TC-ACC-15: Vouchers/discounts section is accessible', async ({ page }) => {
    const voucherLink = page.locator('a[href*="discount"], a:has-text("Vouchers"), a:has-text("Credit slips")');
    if (await voucherLink.first().isVisible()) {
      await voucherLink.first().click({ noWaitAfter: true });
      await page.waitForLoadState('domcontentloaded');
      expect(page.url()).toMatch(/discount|voucher|credit/i);
    }
  });
});
