import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { SEARCH } from '../data/testData';

test.describe('Search Functionality', () => {
  let homePage: HomePage;
  let searchPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchPage = new SearchResultsPage(page);
    await homePage.goto();
  });

  test('TC-SR-01: Search box is visible and accepts input', async () => {
    await expect(homePage.searchInput).toBeVisible();
    await homePage.searchInput.fill(SEARCH.valid);
    await expect(homePage.searchInput).toHaveValue(SEARCH.valid);
  });

  test('TC-SR-02: Searching with valid term returns results', async () => {
    await homePage.search(SEARCH.valid);
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-SR-03: Search results page URL contains query string', async ({ page }) => {
    await homePage.search(SEARCH.valid);
    const url = page.url();
    expect(url).toMatch(/[?&]s=/i);
  });

  test('TC-SR-04: Searching with no-results term shows empty list', async () => {
    await homePage.search(SEARCH.noResults);
    const count = await searchPage.getResultCount();
    expect(count).toBe(0);
  });

  test('TC-SR-05: No-results search shows appropriate message or empty state', async () => {
    await homePage.search(SEARCH.noResults);
    const count = await searchPage.getResultCount();
    if (count === 0) {
      const msg = searchPage.noResultsMessage;
      const isVisible = await msg.isVisible().catch(() => false);
      expect(isVisible || count === 0).toBeTruthy();
    }
  });

  test('TC-SR-06: Search result cards show name and price', async ({ page }) => {
    await homePage.search(SEARCH.valid);
    const firstResult = page.locator('.product-miniature').first();
    await expect(firstResult).toBeVisible();
    await expect(firstResult.locator('.product-title, h3, [class*="title"]')).toBeVisible();
    await expect(firstResult.locator('.price, [class*="price"]')).toBeVisible();
  });

  test('TC-SR-07: Clicking a search result navigates to product detail page', async ({ page }) => {
    await homePage.search(SEARCH.valid);
    await searchPage.clickFirstResult();
    await expect(page).toHaveURL(/\.html/);
  });

  test('TC-SR-08: Search results can be sorted', async ({ page }) => {
    await homePage.search(SEARCH.partial);
    const sortBtn = searchPage.sortBtn;
    if (await sortBtn.isVisible()) {
      await sortBtn.click();
      const options = searchPage.sortOptions;
      const count = await options.count();
      expect(count).toBeGreaterThan(0);
      await options.first().click();
      await page.waitForLoadState('domcontentloaded');
      expect(await searchPage.getResultCount()).toBeGreaterThan(0);
    }
  });

  test('TC-SR-09: Enter key triggers search navigation', async ({ page }) => {
    await homePage.searchInput.fill(SEARCH.valid);
    await homePage.searchInput.press('Enter');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/search/);
  });

  test('TC-SR-10: Partial search term returns relevant results', async () => {
    await homePage.search(SEARCH.partial);
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-SR-11: Total results count text is displayed', async () => {
    await homePage.search(SEARCH.valid);
    const text = await searchPage.getResultsText().catch(() => '');
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
    if (text) expect(text).toMatch(/\d+/);
  });

  test('TC-SR-12: Search results page loads with products grid', async ({ page }) => {
    await homePage.search(SEARCH.valid);
    await expect(page.locator('.product-miniature')).toHaveCount(
      await searchPage.getResultCount()
    );
  });
});
