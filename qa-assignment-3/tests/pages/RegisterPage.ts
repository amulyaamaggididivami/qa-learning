import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly genderMaleRadio: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly submitBtn: Locator;
  readonly errorAlert: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.genderMaleRadio = page.locator('#field-id_gender-1');
    this.firstNameInput = page.locator('#field-firstname');
    this.lastNameInput = page.locator('#field-lastname');
    this.emailInput = page.locator('#field-email');
    this.passwordInput = page.locator('#field-password');
    this.termsCheckbox = page.locator('#field-psgdpr, input[name*="psgdpr"]');
    this.submitBtn = page.locator('#customer-form button[type="submit"], form[id="customer-form"] button[type="submit"]');
    this.errorAlert = page.locator('.alert-danger');
    this.pageHeading = page.locator('h1').first();
  }

  async goto() {
    await this.navigate('/registration');
    await this.waitForPageLoad();
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    await this.genderMaleRadio.check().catch(() => {});
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.termsCheckbox.check().catch(() => {});
    await this.submitBtn.click({ noWaitAfter: true });
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('domcontentloaded', { timeout: 40000 }).catch(() => {});
  }
}
