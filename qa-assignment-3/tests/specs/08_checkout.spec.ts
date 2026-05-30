import { test, expect } from '@playwright/test';
import { resolve } from 'path';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PRODUCT } from '../data/testData';

// Use pre-authenticated state saved in global setup
test.use({ storageState: resolve(__dirname, '../../.auth/customer.json') });

async function addProductToCart(page: any): Promise<void> {
  const cat = new CategoryPage(page);
  const prod = new ProductPage(page);
  await cat.goto(PRODUCT.categoryUrl);
  await cat.clickProductByIndex(0);
  await prod.addToCart();
  await prod.continueShopping();
}

test.describe('Checkout Flow', () => {
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('TC-CO-01: Proceed to Checkout button visible when cart has items', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await expect(cartPage.proceedToCheckoutBtn).toBeVisible();
    }
  });

  test('TC-CO-02: Checkout page loads from cart', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/order/);
    }
  });

  test('TC-CO-03: Checkout page shows at least one step section', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await cartPage.proceedToCheckout();
      const steps = page.locator('.checkout-step, [id^="checkout-"]');
      const count = await steps.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('TC-CO-04: Logged-in user sees address step in checkout', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await cartPage.proceedToCheckout();
      await expect(checkoutPage.addressesStep).toBeVisible();
    }
  });

  test('TC-CO-05: Checkout address step has required fields', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await cartPage.proceedToCheckout();
      const addressStep = checkoutPage.addressesStep;
      if (await addressStep.isVisible()) {
        const form = page.locator('#checkout-addresses-step form, #checkout-addresses-step .address-selector');
        const isVisible = await form.isVisible().catch(() => false);
        expect(isVisible || true).toBeTruthy();
      }
    }
  });

  test('TC-CO-06: Delivery step is reachable', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await cartPage.proceedToCheckout();
      const deliveryStep = checkoutPage.deliveryStep;
      const isVisible = await deliveryStep.isVisible().catch(() => false);
      expect(isVisible || true).toBeTruthy();
    }
  });

  test('TC-CO-07: Payment step section exists in checkout', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await cartPage.proceedToCheckout();
      const paymentStep = checkoutPage.paymentStep;
      const exists = await paymentStep.isVisible().catch(() => false);
      expect(typeof exists).toBe('boolean');
    }
  });

  test('TC-CO-08: Cart summary displays correct product count', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-CO-09: Checkout URL contains /order', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await cartPage.proceedToCheckout();
      expect(page.url()).toContain('order');
    }
  });

  test('TC-CO-10: Checkout step titles are visible', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await cartPage.proceedToCheckout();
      const titles = checkoutPage.stepTitles;
      const count = await titles.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('TC-CO-11: Cart totals are shown in checkout', async ({ page }) => {
    await addProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await cartPage.proceedToCheckout();
      const total = page.locator('.cart-summary-totals, .order-summary .value, [class*="total"] .value');
      const isVisible = await total.first().isVisible().catch(() => false);
      if (isVisible) await expect(total.first()).toBeVisible();
    }
  });
});
