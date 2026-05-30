import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  readonly productMiniatures: Locator;
  readonly noResultsMessage: Locator;
  readonly totalProducts: Locator;
  readonly sortBtn: Locator;
  readonly sortOptions: Locator;

  constructor(page: Page) {
    super(page);
    this.productMiniatures = page.locator('.product-miniature');
    this.noResultsMessage = page.locator('.no-results-message, .alert-warning, p:has-text("No results"), p:has-text("no results")');
    this.totalProducts = page.locator('.products__count span');
    this.sortBtn = page.locator('#sort_dropdown_button');
    this.sortOptions = page.locator('.products__sort-dropdown .dropdown-item');
  }

  async getResultCount(): Promise<number> {
    return this.productMiniatures.count();
  }

  async getResultsText(): Promise<string> {
    return (await this.totalProducts.textContent()) ?? '';
  }

  async sortBy(label: string) {
    await this.sortBtn.click();
    await this.page.locator(`.products__sort-dropdown .dropdown-item:has-text("${label}")`).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickFirstResult() {
    await this.productMiniatures.first().locator('a').first().click();
    await this.waitForPageLoad();
  }
}
