# PrestaShop Demo – QA Test Cases

**Application:** https://demo.prestashop.com/en  
**Date:** 2026-05-29  
**Tool:** Playwright + TypeScript  
**Tester:** Amulya  

---

## Test Data

| Key | Value |
|-----|-------|
| Valid Email | pub@prestashop.com |
| Valid Password | 123456789 |
| Invalid Email | notauser@invalid.com |
| Invalid Password | wrongpassword |
| New User Email | testuser{timestamp}@mailinator.com |
| New User Password | Test@12345678 |
| Search Term (valid) | T-shirt |
| Search Term (partial) | shirt |
| Search Term (no results) | xyzqwertynotexist |
| Category URL | /3-clothes |
| Address Line 1 | 123 Automation Street |
| City | Paris |
| Post Code | 75001 |
| Country | France |
| Phone | 0123456789 |

---

## Module 1: Homepage

| ID | Title | Priority | Precondition | Steps | Expected Result | Status |
|----|-------|----------|--------------|-------|-----------------|--------|
| TC-HP-01 | Homepage loads with correct title | High | None | Navigate to `/en` | Page title contains "PrestaShop" | Automated |
| TC-HP-02 | Header logo is visible | High | None | Navigate to `/en` | Logo element is visible | Automated |
| TC-HP-03 | Logo navigates to homepage | Medium | Open any subpage | Click the logo | URL is `/en` or `/en/` | Automated |
| TC-HP-04 | Top navigation menu shows category links | High | None | Navigate to `/en` | At least 1 nav item visible | Automated |
| TC-HP-05 | Featured products section displays products | High | None | Navigate to `/en` | Product miniatures count > 0 | Automated |
| TC-HP-06 | Product cards show name and price | High | None | Navigate to `/en` | Each card has `.product-title` and `.price` | Automated |
| TC-HP-07 | Product card click navigates to PDP | High | None | Click first product | URL matches `*.html` | Automated |
| TC-HP-08 | Search widget is visible | High | None | Navigate to `/en` | Search input is visible | Automated |
| TC-HP-09 | Cart icon is visible | High | None | Navigate to `/en` | Cart block visible | Automated |
| TC-HP-10 | Sign-in link visible when not logged in | High | Not logged in | Navigate to `/en` | Sign-in anchor visible | Automated |
| TC-HP-11 | Footer is present with links | Medium | None | Navigate to `/en` | Footer visible, link count > 0 | Automated |
| TC-HP-12 | Newsletter subscription block is visible | Low | None | Scroll to footer area | Newsletter input visible | Automated |
| TC-HP-13 | Newsletter rejects non-email input | Medium | None | Enter "not-an-email", submit | Browser validation error shown | Automated |
| TC-HP-14 | Product hover shows quick actions | Medium | None | Hover over first product | Quick-add or thumbnail overlay visible | Automated |
| TC-HP-15 | Social media links in footer | Low | None | Check footer | Social link elements present | Automated |

---

## Module 2: Search

| ID | Title | Priority | Precondition | Steps | Expected Result | Status |
|----|-------|----------|--------------|-------|-----------------|--------|
| TC-SR-01 | Search box visible and accepts input | High | None | Navigate to `/en`, fill search | Input has entered value | Automated |
| TC-SR-02 | Valid search term returns results | High | None | Search "T-shirt" | Product count > 0 | Automated |
| TC-SR-03 | Results page shows search term | Medium | None | Search "T-shirt" | Heading contains query fragment | Automated |
| TC-SR-04 | No-results term shows empty list | High | None | Search "xyzqwertynotexist" | Product count = 0 | Automated |
| TC-SR-05 | No-results shows appropriate message | Medium | None | Search "xyzqwertynotexist" | No-results message or empty list | Automated |
| TC-SR-06 | Result cards show name and price | High | None | Search "T-shirt" | First result has title and price | Automated |
| TC-SR-07 | Clicking a result navigates to PDP | High | Search with results | Click first result | URL ends in `.html` | Automated |
| TC-SR-08 | Results sortable by price | Medium | Search with multiple results | Use sort dropdown | Prices in ascending order | Automated |
| TC-SR-09 | Enter key triggers search | Medium | None | Type query, press Enter | Redirected to search results page | Automated |
| TC-SR-10 | Partial term returns results | Medium | None | Search "shirt" | Product count > 0 | Automated |
| TC-SR-11 | URL contains search query param | Low | None | Search "T-shirt" | URL contains `s=` or `q=` | Automated |
| TC-SR-12 | Search navigates away from home | Low | None | Search from home | URL changes to search results | Automated |

---

## Module 3: Category / Product Listing

| ID | Title | Priority | Precondition | Steps | Expected Result | Status |
|----|-------|----------|--------------|-------|-----------------|--------|
| TC-CAT-01 | Category page loads with heading | High | None | Navigate to `/3-clothes` | Heading visible with text | Automated |
| TC-CAT-02 | Product list displays products | High | None | Navigate to `/3-clothes` | Product count > 0 | Automated |
| TC-CAT-03 | Each product card shows name and price | High | None | Navigate to `/3-clothes` | First card has title and price | Automated |
| TC-CAT-04 | Total product count is displayed | Medium | None | Navigate to `/3-clothes` | Count text contains a number | Automated |
| TC-CAT-05 | Filter sidebar is visible | High | None | Navigate to `/3-clothes` | Facets/filter sidebar visible | Automated |
| TC-CAT-06 | Applying filter narrows results | High | Filter available | Click first filter checkbox | Product count ≤ initial count | Automated |
| TC-CAT-07 | Active filter chip appears | Medium | None | Apply a filter | Filter chip visible | Automated |
| TC-CAT-08 | Clearing filters restores full list | Medium | Filters applied | Click "Clear all" | Count restored to original | Automated |
| TC-CAT-09 | Sort by price ascending | High | None | Select "Price, low to high" | Prices in ascending order | Automated |
| TC-CAT-10 | Sort by price descending | High | None | Select "Price, high to low" | Prices in descending order | Automated |
| TC-CAT-11 | Clicking product navigates to PDP | High | None | Click first product | URL ends in `.html` | Automated |
| TC-CAT-12 | Subcategory links navigable | Medium | Subcategories exist | Click subcategory | URL changes | Automated |
| TC-CAT-13 | Breadcrumb shows correct category | Medium | None | Navigate to `/3-clothes` | Breadcrumb contains "Clothes" | Automated |
| TC-CAT-14 | Product images are loaded | High | None | Navigate to `/3-clothes` | First product image visible with src | Automated |

---

## Module 4: Product Detail Page

| ID | Title | Priority | Precondition | Steps | Expected Result | Status |
|----|-------|----------|--------------|-------|-----------------|--------|
| TC-PDP-01 | Product title is visible | High | Open any PDP | Navigate to PDP | Title visible and non-empty | Automated |
| TC-PDP-02 | Product price is displayed | High | Open any PDP | Navigate to PDP | Price element visible with number | Automated |
| TC-PDP-03 | Product cover image is visible | High | Open any PDP | Navigate to PDP | Cover image visible | Automated |
| TC-PDP-04 | Quantity defaults to 1 | High | Open any PDP | Check quantity input | Value = "1" | Automated |
| TC-PDP-05 | Quantity can be increased | High | Open any PDP | Click increase button | Value ≥ 2 | Automated |
| TC-PDP-06 | Quantity decreases back to 1 | High | Qty increased | Click decrease button | Value = 1 | Automated |
| TC-PDP-07 | Add to Cart button works | High | Open any PDP | Click "Add to Cart" | No error; modal or count update | Automated |
| TC-PDP-08 | Add to cart shows confirmation | High | Open any PDP | Click "Add to Cart" | Modal visible or cart count increases | Automated |
| TC-PDP-09 | Continue shopping dismisses modal | High | After add-to-cart | Click "Continue Shopping" | Modal hidden | Automated |
| TC-PDP-10 | Proceed to checkout from modal | High | After add-to-cart | Click "Proceed to Checkout" | Navigated to cart/order page | Automated |
| TC-PDP-11 | Description tab is present | Medium | Open any PDP | Check tabs | Description tab visible/clickable | Automated |
| TC-PDP-12 | Breadcrumb navigation visible | Medium | Open any PDP | Check breadcrumb | Breadcrumb trail visible | Automated |
| TC-PDP-13 | Variants shown when available | Medium | Product with variants | Open PDP | Variants section visible | Automated |
| TC-PDP-14 | Thumbnail gallery present | Medium | Open any PDP | Check thumbnails | Count ≥ 0 | Automated |
| TC-PDP-15 | Availability shown | Low | Open any PDP | Check availability text | Element present | Automated |

---

## Module 5: Shopping Cart

| ID | Title | Priority | Precondition | Steps | Expected Result | Status |
|----|-------|----------|--------------|-------|-----------------|--------|
| TC-CART-01 | Empty cart shows empty message | High | Cart is empty | Navigate to `/cart` | Empty message visible | Automated |
| TC-CART-02 | Adding product increases cart count | High | None | Add a product from PDP | Cart count increases | Automated |
| TC-CART-03 | Cart page shows added product | High | Product added | Navigate to `/cart` | Item count > 0 | Automated |
| TC-CART-04 | Cart item shows product name | High | Product added | Navigate to `/cart` | Product name visible and non-empty | Automated |
| TC-CART-05 | Removing item decreases count | High | 1+ items in cart | Click remove on item | Count decreases | Automated |
| TC-CART-06 | Cart shows subtotal | High | Product added | Navigate to `/cart` | Subtotal has numeric value | Automated |
| TC-CART-07 | Cart shows total | High | Product added | Navigate to `/cart` | Total has numeric value | Automated |
| TC-CART-08 | Proceed to Checkout visible with items | High | Product in cart | Navigate to `/cart` | CTA button visible | Automated |
| TC-CART-09 | Invalid promo code shows error | Medium | Product in cart | Enter invalid promo | Error message shown | Automated |
| TC-CART-10 | Cart count in header updates | High | After add-to-cart | Check header cart icon | Count > 0 | Automated |
| TC-CART-11 | Cart icon navigates to cart page | Medium | None | Click cart icon | URL contains `/cart` | Automated |
| TC-CART-12 | Cart persists after navigation | High | Product in cart | Navigate away and back | Items still present | Automated |

---

## Module 6: Authentication

| ID | Title | Priority | Precondition | Steps | Expected Result | Status |
|----|-------|----------|--------------|-------|-----------------|--------|
| TC-AUTH-01 | Login page loads | High | None | Navigate to `/login` | Page heading visible | Automated |
| TC-AUTH-02 | Login form fields visible | High | None | Navigate to `/login` | Email, password, submit visible | Automated |
| TC-AUTH-03 | Login with valid credentials | High | None | Enter valid email/password | Redirected to account or homepage | Automated |
| TC-AUTH-04 | Login with invalid credentials shows error | High | None | Enter wrong credentials | Error alert visible | Automated |
| TC-AUTH-05 | Empty email shows validation | High | None | Click submit without email | Email field validation fails | Automated |
| TC-AUTH-06 | Valid email + wrong password shows error | High | None | Enter real email, wrong pass | Error alert visible | Automated |
| TC-AUTH-07 | Forgot password link visible | Medium | None | Navigate to `/login` | Forgot password link present | Automated |
| TC-AUTH-08 | Forgot password link navigates to reset | Medium | None | Click forgot password | URL contains `password-recovery` | Automated |
| TC-AUTH-09 | Create account link visible | Medium | None | Navigate to `/login` | Create account link present | Automated |
| TC-AUTH-10 | Create account link navigates to registration | Medium | None | Click create account | URL contains `registration` | Automated |
| TC-AUTH-11 | Password field masks input | High | None | Check password field type | type="password" | Automated |
| TC-AUTH-12 | Logged-in user can sign out | High | Logged in | Click sign out | Redirected to login or home | Automated |
| TC-AUTH-13 | After logout sign-in link reappears | High | After logout | Check header | Sign-in link visible | Automated |
| TC-AUTH-14 | Registration page loads | High | None | Navigate to `/registration` | URL matches `/registration` | Automated |
| TC-AUTH-15 | Registration form fields visible | High | None | Navigate to `/registration` | Name, email, password visible | Automated |
| TC-AUTH-16 | Registering with existing email shows error | High | None | Use existing email to register | Error alert visible | Automated |
| TC-AUTH-17 | Empty form submission shows validation | High | None | Submit empty registration form | Validation error shown | Automated |
| TC-AUTH-18 | Weak password shows error | High | None | Enter 3-char password | Error or validation shown | Automated |

---

## Module 7: My Account

| ID | Title | Priority | Precondition | Steps | Expected Result | Status |
|----|-------|----------|--------------|-------|-----------------|--------|
| TC-ACC-01 | My Account page loads after login | High | Logged in | Navigate to `/my-account` | URL contains `/my-account` | Automated |
| TC-ACC-02 | Account page shows heading | High | Logged in | Navigate to `/my-account` | Heading visible | Automated |
| TC-ACC-03 | Account navigation links present | High | Logged in | Navigate to `/my-account` | Link count > 0 | Automated |
| TC-ACC-04 | Order history link visible | High | Logged in | Navigate to `/my-account` | Orders link visible | Automated |
| TC-ACC-05 | Order History page navigates correctly | High | Logged in | Click orders link | URL contains `order` or `history` | Automated |
| TC-ACC-06 | Order history shows table or empty state | Medium | Logged in | Navigate to orders | Table or "no orders" message | Automated |
| TC-ACC-07 | Addresses link visible | High | Logged in | Navigate to `/my-account` | Addresses link visible | Automated |
| TC-ACC-08 | Addresses page navigates correctly | High | Logged in | Click addresses link | URL contains `address` | Automated |
| TC-ACC-09 | Add address button present | Medium | Logged in | Navigate to addresses | Add address button visible | Automated |
| TC-ACC-10 | Personal information link visible | High | Logged in | Navigate to `/my-account` | Personal info link visible | Automated |
| TC-ACC-11 | Personal info form is editable | High | Logged in | Navigate to identity | Fields visible on identity page | Automated |
| TC-ACC-12 | Personal info pre-filled with account email | High | Logged in | Navigate to identity | Email input = logged-in email | Automated |
| TC-ACC-13 | Breadcrumb on account page correct | Medium | Logged in | Navigate to `/my-account` | Breadcrumb visible | Automated |
| TC-ACC-14 | Sign out from account page works | High | Logged in | Click sign out | Redirected to login/home | Automated |
| TC-ACC-15 | Vouchers section accessible | Low | Logged in | Click vouchers/discounts | URL contains discount/voucher | Automated |

---

## Module 8: Checkout

| ID | Title | Priority | Precondition | Steps | Expected Result | Status |
|----|-------|----------|--------------|-------|-----------------|--------|
| TC-CO-01 | Proceed to Checkout button visible with items | High | Product in cart | Navigate to `/cart` | CTA button visible | Automated |
| TC-CO-02 | Checkout page loads from cart | High | Product in cart | Click Proceed to Checkout | URL contains `order` | Automated |
| TC-CO-03 | Personal information step shown | High | In checkout | View checkout page | Personal info step visible | Automated |
| TC-CO-04 | Guest checkout option available | High | Not logged in | View checkout page | Guest checkout option visible | Automated |
| TC-CO-05 | Login during checkout available | Medium | Not logged in | View checkout | Sign-in section visible | Automated |
| TC-CO-06 | Logged-in user skips personal info step | High | Logged in, product in cart | Go to checkout | Address step shown directly | Automated |
| TC-CO-07 | Delivery options displayed in shipping step | High | Logged in, at delivery step | Reach delivery step | Delivery options present | Automated |
| TC-CO-08 | Payment options shown in payment step | High | Logged in, at payment step | Reach payment step | Payment option count > 0 | Automated |
| TC-CO-09 | Order summary shows correct product names | High | Product in cart | Navigate to `/cart` | Product name non-empty | Automated |
| TC-CO-10 | Checkout URL is correct | Medium | Logged in, product in cart | Start checkout | URL contains `/order` | Automated |
| TC-CO-11 | Terms checkbox present on payment step | High | At payment step | Reach payment | Terms checkbox visible | Automated |

---

## Automation Run Instructions

```bash
# Install dependencies
cd qa-assignment-3
npm install
npx playwright install --with-deps

# Run all tests (headless, Chromium only)
npx playwright test

# Run specific module
npx playwright test tests/specs/01_homepage.spec.ts

# Run with headed browser
npx playwright test --headed

# Run on specific browser
npx playwright test --project=chromium

# Generate and open HTML report
npx playwright show-report
```

---

## Known Constraints

| Constraint | Detail |
|-----------|--------|
| Demo reset | The PrestaShop demo resets periodically; cart/order data may be cleared |
| Guest checkout | Demo may restrict placing real orders; checkout tests stop before final order submission |
| New user registration | Uses `Date.now()` in email to avoid conflicts on repeated runs |
| Network latency | Tests use `networkidle` waits to handle demo server slowness |
| Shared demo account | `pub@prestashop.com` is shared; account state (addresses, orders) may vary |
