import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly personalInfoStep: Locator;
  readonly guestEmailInput: Locator;
  readonly continueAsGuestBtn: Locator;
  readonly addressesStep: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly address1Input: Locator;
  readonly postcodeInput: Locator;
  readonly cityInput: Locator;
  readonly phoneInput: Locator;
  readonly confirmAddressBtn: Locator;
  readonly deliveryStep: Locator;
  readonly deliveryOptions: Locator;
  readonly confirmDeliveryBtn: Locator;
  readonly paymentStep: Locator;
  readonly paymentOptions: Locator;
  readonly termsCheckbox: Locator;
  readonly placeOrderBtn: Locator;
  readonly orderConfirmation: Locator;
  readonly stepTitles: Locator;

  constructor(page: Page) {
    super(page);
    this.personalInfoStep = page.locator('#checkout-personal-information-step');
    this.guestEmailInput = page.locator('[id*="email-guest"], #checkout-guest-form #field-email').first();
    this.continueAsGuestBtn = page.locator('[data-link-action="continue-as-guest"], #checkout-guest-form button[type="submit"]');
    this.addressesStep = page.locator('#checkout-addresses-step');
    this.firstNameInput = page.locator('#checkout-addresses-step #field-firstname, #field-firstname').first();
    this.lastNameInput = page.locator('#checkout-addresses-step #field-lastname, #field-lastname').first();
    this.address1Input = page.locator('#field-address1');
    this.postcodeInput = page.locator('#field-postcode');
    this.cityInput = page.locator('#field-city');
    this.phoneInput = page.locator('#field-phone');
    this.confirmAddressBtn = page.locator('#checkout-addresses-step button[name="confirm-addresses"], button.continue[name="confirm-addresses"]');
    this.deliveryStep = page.locator('#checkout-delivery-step');
    this.deliveryOptions = page.locator('.delivery-option');
    this.confirmDeliveryBtn = page.locator('#checkout-delivery-step button.continue, button[name="confirmDeliveryOption"]');
    this.paymentStep = page.locator('#checkout-payment-step');
    this.paymentOptions = page.locator('.payment-option');
    this.termsCheckbox = page.locator('[name*="terms"], [id*="conditions_to_approve"]').last();
    this.placeOrderBtn = page.locator('.payment-confirmation button[type="submit"], #payment-confirmation button');
    this.orderConfirmation = page.locator('h1:has-text("Order confirmation"), .page-title h1');
    this.stepTitles = page.locator('.checkout-step .step-title, .step-title');
  }

  async goto() {
    await this.navigate('/order');
    await this.waitForPageLoad();
  }
}
