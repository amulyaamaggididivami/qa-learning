import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly removeFromCartBtns: Locator;
  readonly quantityInputs: Locator;
  readonly subtotalAmount: Locator;
  readonly totalAmount: Locator;
  readonly proceedToCheckoutBtn: Locator;
  readonly emptyCartMessage: Locator;
  readonly promoCodeInput: Locator;
  readonly promoCodeBtn: Locator;
  readonly promoError: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart-item');
    this.cartItemNames = page.locator('.cart-item .product-name, .cart-item .label');
    this.removeFromCartBtns = page.locator('.remove-from-cart, a[data-link-action="delete-from-cart"]');
    this.quantityInputs = page.locator('.cart-item input[type="number"]');
    this.subtotalAmount = page.locator('.cart-subtotals .value, .subtotal .value').first();
    this.totalAmount = page.locator('.cart-total .value, .order-total .value, [class*="total"] .value').first();
    this.proceedToCheckoutBtn = page.locator('.checkout a, a[href*="order"]').first();
    this.emptyCartMessage = page.locator('.cart-empty-page, p:has-text("Your cart is empty")');
    this.promoCodeInput = page.locator('input[name="discount_name"]');
    this.promoCodeBtn = page.locator('button[name="addVoucher"], button:has-text("Add")').first();
    this.promoError = page.locator('.promo-code .alert-danger, [id*="promo"] .alert-danger');
  }

  async goto() {
    await this.navigate('/cart');
    await this.waitForPageLoad();
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeItemByIndex(index: number) {
    await this.removeFromCartBtns.nth(index).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async updateQuantity(index: number, qty: number) {
    const input = this.quantityInputs.nth(index);
    await input.fill(String(qty));
    await input.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getSubtotal(): Promise<string> {
    return (await this.subtotalAmount.textContent()) ?? '';
  }

  async getTotal(): Promise<string> {
    return (await this.totalAmount.textContent()) ?? '';
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutBtn.click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async applyPromoCode(code: string) {
    if (await this.promoCodeInput.isVisible()) {
      await this.promoCodeInput.fill(code);
      await this.promoCodeBtn.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async isCartEmpty(): Promise<boolean> {
    return this.emptyCartMessage.isVisible().catch(() => false);
  }
}
