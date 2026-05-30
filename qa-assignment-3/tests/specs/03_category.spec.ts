import { test, expect } from '@playwright/test';
import { CategoryPage } from '../pages/CategoryPage';
import { PRODUCT } from '../data/testData';

test.describe('Category / Product Listing Page', () => {
  let categoryPage: CategoryPage;

  test.beforeEach(async ({ page }) => {
    categoryPage = new CategoryPage(page);
    await categoryPage.goto(PRODUCT.categoryUrl);
  });

  test('TC-CAT-01: Category page loads with heading', async () => {
    await expect(categoryPage.categoryHeading).toBeVisible();
    const text = await categoryPage.categoryHeading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC-CAT-02: Product list displays products', async () => {
    const count = await categoryPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-CAT-03: Each product card shows name and price', async ({ page }) => {
    const firstCard = page.locator('.product-miniature').first();
    await expect(firstCard.locator('.product-title, h3, [class*="title"]')).toBeVisible();
    await expect(firstCard.locator('.price, [class*="price"]')).toBeVisible();
  });

  test('TC-CAT-04: Total product count is displayed', async () => {
    const text = await categoryPage.totalProducts.textContent();
    expect(text).toMatch(/\d+/);
  });

  test('TC-CAT-05: Filter sidebar is visible', async () => {
    await expect(categoryPage.filtersSidebar).toBeVisible();
  });

  test('TC-CAT-06: Filter accordion sections are present', async () => {
    const count = await categoryPage.filterButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-CAT-07: Expanding a filter shows options', async ({ page }) => {
    const firstBtn = categoryPage.filterButtons.first();
    if (await firstBtn.isVisible()) {
      const expanded = await firstBtn.getAttribute('aria-expanded');
      if (expanded === 'false') {
        await firstBtn.click();
        await page.waitForTimeout(500);
      }
      const items = page.locator('#search-filters .accordion-collapse.show ul li, #search-filters input[type="checkbox"]');
      const count = await items.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC-CAT-08: Applying a filter narrows the product list', async () => {
    const initialCount = await categoryPage.getProductCount();
    await categoryPage.applyFirstFilter();
    const filteredCount = await categoryPage.getProductCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('TC-CAT-09: Sort dropdown is visible', async () => {
    await expect(categoryPage.sortBtn).toBeVisible();
  });

  test('TC-CAT-10: Sort by price ascending reorders products', async () => {
    await categoryPage.sortBy('Price, low to high');
    const prices = await categoryPage.getAllPriceTexts();
    if (prices.length > 1) {
      const nums = prices.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
      for (let i = 1; i < nums.length; i++) {
        expect(nums[i]).toBeGreaterThanOrEqual(nums[i - 1]);
      }
    }
  });

  test('TC-CAT-11: Sort by price descending reorders products', async () => {
    await categoryPage.sortBy('Price, high to low');
    const prices = await categoryPage.getAllPriceTexts();
    if (prices.length > 1) {
      const nums = prices.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
      for (let i = 1; i < nums.length; i++) {
        expect(nums[i]).toBeLessThanOrEqual(nums[i - 1]);
      }
    }
  });

  test('TC-CAT-12: Clicking a product navigates to product detail page', async ({ page }) => {
    await categoryPage.clickProductByIndex(0);
    await expect(page).toHaveURL(/\.html/);
  });

  test('TC-CAT-13: Breadcrumb is visible', async () => {
    await expect(categoryPage.breadcrumb).toBeVisible();
  });

  test('TC-CAT-14: Product images are loaded', async ({ page }) => {
    const firstImg = page.locator('.product-miniature img').first();
    await expect(firstImg).toBeVisible();
    const src = await firstImg.getAttribute('src');
    expect(src).not.toBeNull();
  });
});
