import { Page, Locator } from '@playwright/test';
import { getShopUrl } from '../utils/shopUrl';

export class BasePage {
  readonly page: Page;
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly cartLink: Locator;
  readonly cartCount: Locator;
  readonly topNavItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('a.navbar-brand');
    this.searchInput = page.locator('.js-search-input');
    this.cartLink = page.locator('.blockcart');
    this.cartCount = page.locator('.header-block__badge');
    this.topNavItems = page.locator('.ps-mainmenu__tree-link');
  }

  async navigate(path = '/') {
    await this.page.goto(getShopUrl() + path);
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickLogo() {
    await this.logo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToCart() {
    await this.cartLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCartCount(): Promise<string> {
    return (await this.cartCount.textContent()) ?? '0';
  }

  async isUserLoggedIn(): Promise<boolean> {
    const logoutLink = this.page.locator('a[href*="logout"]');
    return logoutLink.isVisible().catch(() => false);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
