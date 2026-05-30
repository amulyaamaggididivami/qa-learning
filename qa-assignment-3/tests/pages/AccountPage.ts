import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  readonly pageHeading: Locator;
  readonly accountLinks: Locator;
  readonly ordersLink: Locator;
  readonly addressesLink: Locator;
  readonly personalInfoLink: Locator;
  readonly signOutLink: Locator;
  readonly orderRows: Locator;
  readonly addressCards: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly saveBtn: Locator;
  readonly successAlert: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('h1').first();
    this.accountLinks = page.locator('.my-account-link, .ps-myaccount-link, a[href*="my-account"]');
    this.ordersLink = page.locator('a[href*="order"]').first();
    this.addressesLink = page.locator('a[href*="address"]').first();
    this.personalInfoLink = page.locator('a[href*="identity"]').first();
    this.signOutLink = page.locator('a[href*="logout"]');
    this.orderRows = page.locator('#order-list tbody tr, .orders-list tr, table tbody tr');
    this.addressCards = page.locator('.address-item, article.address');
    this.firstNameInput = page.locator('#field-firstname');
    this.lastNameInput = page.locator('#field-lastname');
    this.emailInput = page.locator('#field-email');
    this.saveBtn = page.locator('#customer-form button[type="submit"], form button[type="submit"]').last();
    this.successAlert = page.locator('.alert-success');
    this.breadcrumb = page.locator('.breadcrumb, nav[aria-label="breadcrumb"]');
  }

  async goto() {
    await this.navigate('/my-account');
    await this.waitForPageLoad();
  }

  async goToOrders() {
    await this.ordersLink.click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async goToAddresses() {
    await this.addressesLink.click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async goToPersonalInfo() {
    await this.personalInfoLink.click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  async getOrderCount(): Promise<number> {
    return this.orderRows.count();
  }

  async getAddressCount(): Promise<number> {
    return this.addressCards.count();
  }

  async signOut() {
    await this.signOutLink.first().click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }
}
