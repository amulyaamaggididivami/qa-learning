# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01_homepage.spec.ts >> Homepage >> TC-HP-01: Homepage loads with correct title
- Location: tests/specs/01_homepage.spec.ts:13:7

# Error details

```
TimeoutError: page.goto: Timeout 45000ms exceeded.
Call log:
  - navigating to "https://limber-suggestion.demo.prestashop.com/", waiting until "load"

```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | import { getShopUrl } from '../utils/shopUrl';
  3  | 
  4  | export class BasePage {
  5  |   readonly page: Page;
  6  |   readonly logo: Locator;
  7  |   readonly searchInput: Locator;
  8  |   readonly cartLink: Locator;
  9  |   readonly cartCount: Locator;
  10 |   readonly topNavItems: Locator;
  11 | 
  12 |   constructor(page: Page) {
  13 |     this.page = page;
  14 |     this.logo = page.locator('a.navbar-brand');
  15 |     this.searchInput = page.locator('.js-search-input');
  16 |     this.cartLink = page.locator('.blockcart');
  17 |     this.cartCount = page.locator('.header-block__badge');
  18 |     this.topNavItems = page.locator('.ps-mainmenu__tree-link');
  19 |   }
  20 | 
  21 |   async navigate(path = '/') {
> 22 |     await this.page.goto(getShopUrl() + path);
     |                     ^ TimeoutError: page.goto: Timeout 45000ms exceeded.
  23 |   }
  24 | 
  25 |   async search(term: string) {
  26 |     await this.searchInput.fill(term);
  27 |     await this.searchInput.press('Enter');
  28 |     await this.page.waitForLoadState('domcontentloaded');
  29 |   }
  30 | 
  31 |   async clickLogo() {
  32 |     await this.logo.click();
  33 |     await this.page.waitForLoadState('domcontentloaded');
  34 |   }
  35 | 
  36 |   async goToCart() {
  37 |     await this.cartLink.click();
  38 |     await this.page.waitForLoadState('domcontentloaded');
  39 |   }
  40 | 
  41 |   async getCartCount(): Promise<string> {
  42 |     return (await this.cartCount.textContent()) ?? '0';
  43 |   }
  44 | 
  45 |   async isUserLoggedIn(): Promise<boolean> {
  46 |     const logoutLink = this.page.locator('a[href*="logout"]');
  47 |     return logoutLink.isVisible().catch(() => false);
  48 |   }
  49 | 
  50 |   async waitForPageLoad() {
  51 |     await this.page.waitForLoadState('domcontentloaded');
  52 |   }
  53 | }
  54 | 
```