import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productCoverImage: Locator;
  readonly quantityInput: Locator;
  readonly increaseQtyBtn: Locator;
  readonly decreaseQtyBtn: Locator;
  readonly addToCartBtn: Locator;
  readonly productVariants: Locator;
  readonly sizeSelect: Locator;
  readonly productTabs: Locator;
  readonly breadcrumb: Locator;
  readonly cartDrawer: Locator;
  readonly continueShoppingBtn: Locator;
  readonly cartDrawerCheckoutBtn: Locator;
  readonly cartDrawerProductName: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('h1').first();
    this.productPrice = page.locator('.product__prices .product__regular-price, .product__prices .price, [itemprop="price"]').first();
    this.productCoverImage = page.locator('.product-cover img, .product__cover img').first();
    this.quantityInput = page.locator('#quantity_wanted, input[name="qty"]');
    this.increaseQtyBtn = page.locator('.js-increment-quantity, [aria-label*="increase" i], .input-group button:last-child');
    this.decreaseQtyBtn = page.locator('.js-decrement-quantity, [aria-label*="decrease" i], .input-group button:first-child');
    this.addToCartBtn = page.locator('button[data-button-action="add-to-cart"], .product__add-to-cart-button');
    this.productVariants = page.locator('.product__variants, .product-variants');
    this.sizeSelect = page.locator('select[data-product-attribute]').first();
    this.productTabs = page.locator('.product-tabs .nav-link, .product__tabs .nav-link');
    this.breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
    this.cartDrawer = page.locator('.blockcart-modal, #cart-offcanvas, .offcanvas-cart, [id*="blockcart"]');
    this.continueShoppingBtn = page.locator('button[data-bs-dismiss="offcanvas"], .btn-close, a:has-text("Continue shopping")');
    this.cartDrawerCheckoutBtn = page.locator('.blockcart-modal .btn-primary, #cart-offcanvas .btn-primary').first();
    this.cartDrawerProductName = page.locator('.blockcart-modal .product-name, #cart-offcanvas .product-name').first();
  }

  async getProductName(): Promise<string> {
    return (await this.productTitle.textContent()) ?? '';
  }

  async getPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? '';
  }

  async setQuantity(qty: number) {
    await this.quantityInput.fill(String(qty));
  }

  async increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.increaseQtyBtn.click();
      await this.page.waitForTimeout(300);
    }
  }

  async decreaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.decreaseQtyBtn.click();
      await this.page.waitForTimeout(300);
    }
  }

  async addToCart() {
    await this.addToCartBtn.first().waitFor({ state: 'visible' });
    await this.addToCartBtn.first().click();
    await this.page.waitForTimeout(2000);
  }

  async continueShopping() {
    const dismiss = this.page.locator('button[data-bs-dismiss="offcanvas"], .btn-close').first();
    if (await dismiss.isVisible().catch(() => false)) {
      await dismiss.click();
      await this.page.waitForTimeout(500);
      return;
    }
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
  }

  async proceedToCheckoutFromDrawer() {
    await this.cartDrawerCheckoutBtn.click();
    await this.waitForPageLoad();
  }

  async getThumbnailCount(): Promise<number> {
    return this.page.locator('.product-images img, .product-thumbnails img').count();
  }
}
