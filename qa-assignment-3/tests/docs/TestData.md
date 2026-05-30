# Test Data – PrestaShop Demo QA Assignment 3

**Source file:** `tests/data/testData.ts`  
**Author:** Amulya  
**Date:** 2026-05-30  

All test data is centralised in `testData.ts` and imported by spec files. This document is the human-readable reference.

---

## 1. Authentication Credentials

| Key | Value | Used In |
|-----|-------|---------|
| Valid email | `pub@prestashop.com` | TC-AUTH-03, global.setup.ts login |
| Valid password | `123456789` | TC-AUTH-03, global.setup.ts login |
| Invalid email | `notauser@invalid.com` | TC-AUTH-04 |
| Invalid password | `wrongpassword` | TC-AUTH-04, TC-AUTH-06 |

> **Note:** `pub@prestashop.com` is the public demo account shared by all visitors. Account state (addresses, orders) may vary between test runs.

---

## 2. New User Registration

| Key | Value | Notes |
|-----|-------|-------|
| First name | `Test` | Static |
| Last name | `Automation` | Static |
| Email | `testuser{Date.now()}@mailinator.com` | Dynamic; unique per run |
| Password | `Test@12345678` | Meets PS8 minimum requirements |

> `Date.now()` is evaluated at module load time, so the email is unique per test run but constant within a single run.

---

## 3. Search Terms

| Key | Value | Expected Outcome |
|-----|-------|-----------------|
| `SEARCH.valid` | `T-shirt` | Returns ≥ 1 results |
| `SEARCH.partial` | `shirt` | Returns ≥ 1 results (broader match) |
| `SEARCH.noResults` | `xyzqwertynotexist` | Returns 0 results |

---

## 4. Product / Category Navigation

| Key | Value | Notes |
|-----|-------|-------|
| `PRODUCT.categoryUrl` | `/3-clothes` | Clothes category; reliably has products |

Category ID `3` is the default "Clothes" category in the PrestaShop demo seed data. Other category IDs may vary by demo instance.

---

## 5. Shipping Address

| Field | Value | Used In |
|-------|-------|---------|
| First name | `John` | TC-CO-* checkout tests |
| Last name | `Doe` | TC-CO-* checkout tests |
| Address line 1 | `123 Automation Street` | TC-CO-* checkout tests |
| Post code | `75001` | TC-CO-* checkout tests |
| City | `Paris` | TC-CO-* checkout tests |
| Country | France (default) | TC-CO-* checkout tests |
| Phone | `0123456789` | TC-CO-* checkout tests |

---

## 6. Page Routes

| Key | Path | Full URL |
|-----|------|----------|
| `PAGES.home` | `/` | `{shopUrl}/` |
| `PAGES.login` | `/login` | `{shopUrl}/login` |
| `PAGES.register` | `/registration` | `{shopUrl}/registration` |
| `PAGES.cart` | `/cart` | `{shopUrl}/cart` |
| `PAGES.account` | `/my-account` | `{shopUrl}/my-account` |
| `PAGES.contact` | `/contact-us` | `{shopUrl}/contact-us` |

`{shopUrl}` is resolved at runtime from `.shopurl` via `getShopUrl()`.

---

## 7. Data Decisions and Rationale

| Decision | Reason |
|----------|--------|
| Use `pub@prestashop.com` for login tests | Official shared demo credential; always exists |
| Use `Date.now()` in registration email | Avoids "email already registered" errors on repeated runs |
| Use `/3-clothes` for category tests | Category 3 exists in all standard PS8 demo seeds |
| Use `T-shirt` as valid search term | Guaranteed to exist in demo product catalogue |
| Use `xyzqwertynotexist` for no-results | Nonsense string; will not match any real product |
| Paris address / 75001 post code | Valid French postal data; passes PS8 address validation |

---

## 8. Data Not Tested

| Item | Reason Excluded |
|------|----------------|
| Credit card numbers | No real payment processing in demo |
| Order IDs | Orders are shared across all demo visitors; state is unpredictable |
| Voucher / promo codes | TC-CART-09 only checks that an invalid code shows an error; valid codes not hardcoded as they reset with the demo |
