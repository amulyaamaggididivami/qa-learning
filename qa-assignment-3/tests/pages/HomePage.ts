import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly featuredProducts: Locator;
  readonly productMiniatures: Locator;
  readonly newsletterInput: Locator;
  readonly newsletterSubmit: Locator;
  readonly categoryMenuItems: Locator;
  readonly footer: Locator;
  readonly footerLinks: Locator;
  readonly signInLink: Locator;

  constructor(page: Page) {
    super(page);
    this.featuredProducts = page.locator('.featured-products, section.products').first();
    this.productMiniatures = page.locator('.product-miniature');
    this.newsletterInput = page.locator('input[name="email"][placeholder*="email" i]').first();
    this.newsletterSubmit = page.locator('input[name="submitNewsletter"]');
    this.categoryMenuItems = page.locator('.ps-mainmenu__tree-item');
    this.footer = page.locator('footer');
    this.footerLinks = page.locator('footer a');
    this.signInLink = page.locator('a[href*="login"]').first();
  }

  async goto() {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async getProductCount(): Promise<number> {
    return this.productMiniatures.count();
  }

  async clickFirstProduct() {
    await this.productMiniatures.first().locator('a').first().click();
    await this.waitForPageLoad();
  }

  async getCategoryCount(): Promise<number> {
    return this.categoryMenuItems.count();
  }

  async subscribeNewsletter(email: string) {
    await this.newsletterInput.fill(email);
    await this.newsletterSubmit.click();
  }
}
