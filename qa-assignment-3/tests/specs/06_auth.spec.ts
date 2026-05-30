import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AccountPage } from '../pages/AccountPage';
import { CREDENTIALS, NEW_USER } from '../data/testData';

test.describe('Authentication', () => {
  test.describe('Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      await loginPage.goto();
    });

    test('TC-AUTH-01: Login page loads with a heading', async () => {
      await expect(loginPage.pageHeading).toBeVisible();
    });

    test('TC-AUTH-02: Login form fields are visible', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitBtn).toBeVisible();
    });

    test('TC-AUTH-03: Valid credentials redirect to account page', async ({ page }) => {
      await loginPage.login(CREDENTIALS.valid.email, CREDENTIALS.valid.password);
      await expect(page).toHaveURL(/my-account/);
    });

    test('TC-AUTH-04: Invalid credentials show error alert', async () => {
      await loginPage.login(CREDENTIALS.invalid.email, CREDENTIALS.invalid.password);
      await expect(loginPage.errorAlert).toBeVisible();
    });

    test('TC-AUTH-05: Submitting empty form triggers HTML5 validation', async () => {
      await loginPage.submitBtn.click();
      const valid = await loginPage.emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(valid).toBe(false);
    });

    test('TC-AUTH-06: Wrong password for valid email shows error', async () => {
      await loginPage.login(CREDENTIALS.valid.email, 'wrongpassword_xyz');
      await expect(loginPage.errorAlert).toBeVisible();
    });

    test('TC-AUTH-07: Forgot password link is visible', async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
    });

    test('TC-AUTH-08: Forgot password link navigates to recovery page', async ({ page }) => {
      await loginPage.clickForgotPassword();
      await expect(page).toHaveURL(/password-recovery/);
    });

    test('TC-AUTH-09: Create account link is visible', async () => {
      await expect(loginPage.createAccountLink).toBeVisible();
    });

    test('TC-AUTH-10: Create account link navigates to registration', async ({ page }) => {
      await loginPage.clickCreateAccount();
      await expect(page).toHaveURL(/registration/);
    });

    test('TC-AUTH-11: Password field type is "password" (masked)', async () => {
      const type = await loginPage.passwordInput.getAttribute('type');
      expect(type).toBe('password');
    });
  });

  test.describe('Logout', () => {
    test('TC-AUTH-12: Logged-in user can sign out', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(CREDENTIALS.valid.email, CREDENTIALS.valid.password);
      await expect(page).toHaveURL(/my-account/);
      const accountPage = new AccountPage(page);
      await accountPage.signOut();
      await expect(page).toHaveURL(/login|\/$/);
    });

    test('TC-AUTH-13: After logout sign-in link reappears in header', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(CREDENTIALS.valid.email, CREDENTIALS.valid.password);
      await expect(page).toHaveURL(/my-account/);
      const accountPage = new AccountPage(page);
      await accountPage.signOut();
      await expect(page.locator('a[href*="login"]').first()).toBeVisible();
    });
  });

  test.describe('Registration', () => {
    let registerPage: RegisterPage;

    test.beforeEach(async ({ page }) => {
      registerPage = new RegisterPage(page);
      await registerPage.goto();
    });

    test('TC-AUTH-14: Registration page URL is correct', async ({ page }) => {
      expect(page.url()).toContain('registration');
    });

    test('TC-AUTH-15: Registration form fields are visible', async () => {
      await expect(registerPage.firstNameInput).toBeVisible();
      await expect(registerPage.lastNameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
    });

    test('TC-AUTH-16: Registering with existing email shows error', async () => {
      await registerPage.register(
        NEW_USER.firstName,
        NEW_USER.lastName,
        CREDENTIALS.valid.email,
        NEW_USER.password
      );
      await expect(registerPage.errorAlert).toBeVisible();
    });

    test('TC-AUTH-17: Empty form submission shows HTML5 validation', async () => {
      await registerPage.submitBtn.click();
      const valid = await registerPage.firstNameInput.evaluate(
        (el: HTMLInputElement) => el.validity.valid
      );
      expect(valid).toBe(false);
    });

    test('TC-AUTH-18: Weak password shows validation error', async ({ page }) => {
      await registerPage.firstNameInput.fill(NEW_USER.firstName);
      await registerPage.lastNameInput.fill(NEW_USER.lastName);
      await registerPage.emailInput.fill(`newtest${Date.now()}@example.com`);
      await registerPage.passwordInput.fill('123');
      await registerPage.submitBtn.click();
      await page.waitForLoadState('domcontentloaded');
      const isError = await registerPage.errorAlert.isVisible().catch(() => false);
      const isInvalid = await registerPage.passwordInput.evaluate(
        (el: HTMLInputElement) => !el.validity.valid
      );
      expect(isError || isInvalid).toBeTruthy();
    });
  });
});
