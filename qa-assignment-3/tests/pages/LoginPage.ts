import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly forgotPasswordLink: Locator;
  readonly createAccountLink: Locator;
  readonly errorAlert: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#field-email');
    this.passwordInput = page.locator('#field-password');
    this.submitBtn = page.locator('#login-form button[type="submit"]');
    this.forgotPasswordLink = page.locator('a[href*="password-recovery"], a.forgot-password, a:has-text("Forgot")').first();
    this.createAccountLink = page.locator('a[href*="registration"]').first();
    this.errorAlert = page.locator('.alert-danger');
    this.pageHeading = page.locator('h1').first();
  }

  async goto() {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    // Set up nav listener BEFORE clicking so we catch the form-submit navigation
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const navDone = this.page.waitForNavigation({ waitUntil: 'load', timeout: 40000 }).catch(() => {});
    await this.submitBtn.click({ noWaitAfter: true });
    await navDone;
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorAlert.first().textContent()) ?? '';
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
  }

  async clickCreateAccount() {
    await this.createAccountLink.click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
  }
}
