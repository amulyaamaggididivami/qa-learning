import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  readonly categoryHeading: Locator;
  readonly productMiniatures: Locator;
  readonly totalProducts: Locator;
  readonly filtersSidebar: Locator;
  readonly filterButtons: Locator;
  readonly activeFilters: Locator;
  readonly clearAllFilters: Locator;
  readonly sortBtn: Locator;
  readonly sortOptions: Locator;
  readonly paginationNext: Locator;
  readonly productImages: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryHeading = page.locator('h1').first();
    this.productMiniatures = page.locator('.product-miniature');
    this.totalProducts = page.locator('.products__count span');
    this.filtersSidebar = page.locator('#search-filters');
    this.filterButtons = page.locator('#search-filters .accordion-button');
    this.activeFilters = page.locator('.ps-facetedsearch__active-filters .badge, .active_filters .filter-block');
    this.clearAllFilters = page.locator('.js-search-filters-clear-all, a:has-text("Clear all")');
    this.sortBtn = page.locator('#sort_dropdown_button');
    this.sortOptions = page.locator('.products__sort-dropdown .dropdown-item');
    this.paginationNext = page.locator('.pagination .next a, [aria-label="Next"]');
    this.productImages = page.locator('.product-miniature img');
    this.breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
  }

  async goto(path: string) {
    await this.navigate(path);
    await this.waitForPageLoad();
  }

  async getProductCount(): Promise<number> {
    return this.productMiniatures.count();
  }

  async applyFirstFilter() {
    const btn = this.filterButtons.first();
    if (await btn.isVisible()) {
      const isExpanded = await btn.getAttribute('aria-expanded');
      if (isExpanded === 'false') await btn.click();
      const checkbox = this.page.locator('#search-filters input[type="checkbox"]').first();
      if (await checkbox.isVisible()) {
        await checkbox.click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    }
  }

  async sortBy(label: string) {
    await this.sortBtn.click();
    await this.page.locator(`.products__sort-dropdown .dropdown-item:has-text("${label}")`).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickProductByIndex(index: number) {
    await this.productMiniatures.nth(index).locator('a').first().click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async getAllPriceTexts(): Promise<string[]> {
    return this.page.locator('.product-miniature .price, .product-miniature [class*="price"]').allTextContents();
  }

  async getAllProductNames(): Promise<string[]> {
    return this.page.locator('.product-miniature .product-title a, .product-miniature h3 a').allTextContents();
  }
}
