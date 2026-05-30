# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01_homepage.spec.ts >> Homepage >> TC-HP-03: Logo navigates to homepage
- Location: tests/specs/01_homepage.spec.ts:21:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('a.navbar-brand')

```

# Page snapshot

```yaml
- table [ref=e2]:
  - rowgroup [ref=e3]:
    - row "Not found Oops... looks like we couldn't find the shop you're looking for." [ref=e4]:
      - cell "Not found Oops... looks like we couldn't find the shop you're looking for." [ref=e5]:
        - img "Not found" [ref=e6]
        - paragraph [ref=e7]: Oops... looks like we couldn't find the shop you're looking for.
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
  22 |     await this.page.goto(getShopUrl() + path);
  23 |   }
  24 | 
  25 |   async search(term: string) {
  26 |     await this.searchInput.fill(term);
  27 |     await this.searchInput.press('Enter');
  28 |     await this.page.waitForLoadState('domcontentloaded');
  29 |   }
  30 | 
  31 |   async clickLogo() {
> 32 |     await this.logo.click();
     |                     ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
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