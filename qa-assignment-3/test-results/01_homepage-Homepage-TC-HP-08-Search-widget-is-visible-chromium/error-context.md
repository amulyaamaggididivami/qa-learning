# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01_homepage.spec.ts >> Homepage >> TC-HP-08: Search widget is visible
- Location: tests/specs/01_homepage.spec.ts:49:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.js-search-input')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.js-search-input')

```

```yaml
- table:
  - rowgroup:
    - row "Not found Oops... looks like we couldn't find the shop you're looking for.":
      - cell "Not found Oops... looks like we couldn't find the shop you're looking for.":
        - img "Not found"
        - paragraph: Oops... looks like we couldn't find the shop you're looking for.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { HomePage } from '../pages/HomePage';
  3  | import { getShopUrl } from '../utils/shopUrl';
  4  | 
  5  | test.describe('Homepage', () => {
  6  |   let homePage: HomePage;
  7  | 
  8  |   test.beforeEach(async ({ page }) => {
  9  |     homePage = new HomePage(page);
  10 |     await homePage.goto();
  11 |   });
  12 | 
  13 |   test('TC-HP-01: Homepage loads with correct title', async ({ page }) => {
  14 |     await expect(page).toHaveTitle(/PrestaShop/i);
  15 |   });
  16 | 
  17 |   test('TC-HP-02: Header logo is visible', async () => {
  18 |     await expect(homePage.logo).toBeVisible();
  19 |   });
  20 | 
  21 |   test('TC-HP-03: Logo navigates to homepage', async ({ page }) => {
  22 |     await homePage.navigate('/login');
  23 |     await homePage.clickLogo();
  24 |     await expect(page).toHaveURL(getShopUrl() + '/');
  25 |   });
  26 | 
  27 |   test('TC-HP-04: Top navigation menu has category links', async () => {
  28 |     await expect(homePage.topNavItems.first()).toBeVisible();
  29 |     const count = await homePage.getCategoryCount();
  30 |     expect(count).toBeGreaterThan(0);
  31 |   });
  32 | 
  33 |   test('TC-HP-05: Featured products section displays products', async () => {
  34 |     const productCount = await homePage.getProductCount();
  35 |     expect(productCount).toBeGreaterThan(0);
  36 |   });
  37 | 
  38 |   test('TC-HP-06: Product cards show name and price', async ({ page }) => {
  39 |     const firstProduct = page.locator('.product-miniature').first();
  40 |     await expect(firstProduct.locator('.product-title, h3, .product-miniature__title')).toBeVisible();
  41 |     await expect(firstProduct.locator('.price, [class*="price"]')).toBeVisible();
  42 |   });
  43 | 
  44 |   test('TC-HP-07: Product card click navigates to product page', async ({ page }) => {
  45 |     await homePage.clickFirstProduct();
  46 |     await expect(page).toHaveURL(/\.html/);
  47 |   });
  48 | 
  49 |   test('TC-HP-08: Search widget is visible', async () => {
> 50 |     await expect(homePage.searchInput).toBeVisible();
     |                                        ^ Error: expect(locator).toBeVisible() failed
  51 |   });
  52 | 
  53 |   test('TC-HP-09: Cart icon is visible', async () => {
  54 |     await expect(homePage.cartLink).toBeVisible();
  55 |   });
  56 | 
  57 |   test('TC-HP-10: Sign-in link is visible when not logged in', async () => {
  58 |     await expect(homePage.signInLink).toBeVisible();
  59 |   });
  60 | 
  61 |   test('TC-HP-11: Footer is visible with links', async () => {
  62 |     await expect(homePage.footer).toBeVisible();
  63 |     const count = await homePage.footerLinks.count();
  64 |     expect(count).toBeGreaterThan(0);
  65 |   });
  66 | 
  67 |   test('TC-HP-12: Newsletter subscription block is visible', async () => {
  68 |     await expect(homePage.newsletterInput).toBeVisible();
  69 |   });
  70 | 
  71 |   test('TC-HP-13: Newsletter rejects non-email input natively', async () => {
  72 |     await homePage.newsletterInput.fill('not-an-email');
  73 |     await homePage.newsletterSubmit.click();
  74 |     const validity = await homePage.newsletterInput.evaluate((el: HTMLInputElement) => el.validity.valid);
  75 |     expect(validity).toBe(false);
  76 |   });
  77 | 
  78 |   test('TC-HP-14: Product hover shows overlay or quick actions', async ({ page }) => {
  79 |     const firstMiniature = page.locator('.product-miniature').first();
  80 |     await firstMiniature.hover();
  81 |     await page.waitForTimeout(300);
  82 |     const inner = firstMiniature.locator('.product-miniature__inner, .product-miniature__top');
  83 |     await expect(inner).toBeVisible();
  84 |   });
  85 | 
  86 |   test('TC-HP-15: Social media links are present in footer', async ({ page }) => {
  87 |     const socialLinks = page.locator('footer a[href*="facebook"], footer a[href*="twitter"], footer a[href*="instagram"], footer a[href*="youtube"], footer a[href*="linkedin"]');
  88 |     const count = await socialLinks.count();
  89 |     expect(count).toBeGreaterThanOrEqual(0);
  90 |   });
  91 | });
  92 | 
```