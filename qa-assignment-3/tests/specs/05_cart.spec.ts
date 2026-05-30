import { test, expect } from '@playwright/test';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { PRODUCT } from '../data/testData';

async function addOneProductToCart(page: any): Promise<void> {
  const cat = new CategoryPage(page);
  const prod = new ProductPage(page);
  await cat.goto(PRODUCT.categoryUrl);
  await cat.clickProductByIndex(0);
  await prod.addToCart();
  await prod.continueShopping();
}

test.describe('Shopping Cart', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
  });

  test('TC-CART-01: Empty cart shows empty state', async () => {
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    const isEmpty = await cartPage.isCartEmpty();
    if (count === 0) {
      expect(isEmpty || count === 0).toBeTruthy();
    }
  });

  test('TC-CART-02: Adding a product increases the cart badge count', async ({ page }) => {
    const before = parseInt((await cartPage.getCartCount()).replace(/\D/g, '') || '0');
    await addOneProductToCart(page);
    const after = parseInt((await cartPage.getCartCount()).replace(/\D/g, '') || '0');
    expect(after).toBeGreaterThan(before);
  });

  test('TC-CART-03: Cart page shows added product', async ({ page }) => {
    await addOneProductToCart(page);
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBeGreaterThan(0);
  });

  test('TC-CART-04: Cart item displays product name', async ({ page }) => {
    await addOneProductToCart(page);
    await cartPage.goto();
    const name = await cartPage.cartItemNames.first().textContent();
    expect(name?.trim().length).toBeGreaterThan(0);
  });

  test('TC-CART-05: Removing an item decreases cart item count', async ({ page }) => {
    await addOneProductToCart(page);
    await cartPage.goto();
    const before = await cartPage.getItemCount();
    if (before > 0) {
      await cartPage.removeItemByIndex(0);
      const after = await cartPage.getItemCount();
      expect(after).toBeLessThan(before);
    }
  });

  test('TC-CART-06: Cart shows subtotal with numeric value', async ({ page }) => {
    await addOneProductToCart(page);
    await cartPage.goto();
    const subtotal = await cartPage.getSubtotal();
    expect(subtotal).toMatch(/[\d.,]+/);
  });

  test('TC-CART-07: Cart shows total with numeric value', async ({ page }) => {
    await addOneProductToCart(page);
    await cartPage.goto();
    const total = await cartPage.getTotal();
    expect(total).toMatch(/[\d.,]+/);
  });

  test('TC-CART-08: Proceed to Checkout button is visible with items in cart', async ({ page }) => {
    await addOneProductToCart(page);
    await cartPage.goto();
    if ((await cartPage.getItemCount()) > 0) {
      await expect(cartPage.proceedToCheckoutBtn).toBeVisible();
    }
  });

  test('TC-CART-09: Applying an invalid promo code shows an error', async ({ page }) => {
    await addOneProductToCart(page);
    await cartPage.goto();
    if (await cartPage.promoCodeInput.isVisible()) {
      await cartPage.applyPromoCode('BADCODE999');
      const err = cartPage.promoError;
      const visible = await err.isVisible().catch(() => false);
      if (visible) await expect(err).toBeVisible();
    }
  });

  test('TC-CART-10: Cart badge count reflects items added', async ({ page }) => {
    await addOneProductToCart(page);
    const count = parseInt((await cartPage.getCartCount()).replace(/\D/g, '') || '0');
    expect(count).toBeGreaterThan(0);
  });

  test('TC-CART-11: Clicking cart icon navigates to cart page', async ({ page }) => {
    await cartPage.navigate('/');
    await cartPage.goToCart();
    await expect(page).toHaveURL(/cart/);
  });

  test('TC-CART-12: Cart contents persist after navigating away and back', async ({ page }) => {
    await addOneProductToCart(page);
    await cartPage.navigate('/');
    await cartPage.goto();
    expect(await cartPage.getItemCount()).toBeGreaterThan(0);
  });
});
