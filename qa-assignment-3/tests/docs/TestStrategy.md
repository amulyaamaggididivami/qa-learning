# Test Strategy – PrestaShop Demo QA Assignment 3

**Author:** Amulya  
**Date:** 2026-05-30  

---

## 1. Strategy Overview

This is a **risk-based, automation-first** strategy. High-priority user journeys (login, search, add-to-cart, checkout flow) are covered with full end-to-end tests. Lower-priority UI details (social links, newsletter) are covered with lightweight presence checks.

No manual test execution is planned — all test cases are automated with Playwright.

---

## 2. Test Pyramid

```
         [E2E: 8 modules, ~100 tests]
              Playwright + TS
         ─────────────────────────────
         [Integration: not applicable]
              (no API layer exposed)
         ─────────────────────────────
         [Unit: not applicable]
              (black-box testing only)
```

The full suite is at the E2E layer because this is a black-box test of a third-party storefront — there is no access to source code, APIs, or internal services.

---

## 3. Tool Stack

| Tool | Purpose |
|------|---------|
| Playwright | Browser automation and assertions |
| TypeScript | Type-safe test authoring |
| Page Object Model | Selector and action abstraction |
| `global.setup.ts` | One-time session auth + URL provisioning |
| Chromium | Primary browser (Desktop Chrome device profile) |
| HTML Reporter | Run results at `playwright-report/index.html` |

---

## 4. Test Design Principles

### 4.1 Page Object Model
Each page has a dedicated class in `tests/pages/`. Locators and actions live there, not in spec files. This means a selector change requires editing one file, not hunting through specs.

### 4.2 Test Independence
Each test navigates to its required starting state in `beforeEach`. Tests do not chain — a failure in test N does not block test N+1.

### 4.3 Auth Reuse
`global.setup.ts` logs in once and saves session cookies to `.auth/customer.json`. All tests that require an authenticated state load this stored session rather than logging in via the UI on every test. This saves ~5–10 seconds per authenticated test and reduces flakiness from login page variability.

### 4.4 Dynamic URL Resolution
The PrestaShop demo URL changes on each provisioning. `global.setup.ts` resolves the live URL and writes it to `.shopurl`. All pages read it via `getShopUrl()`. No URL is hardcoded in test files.

### 4.5 Selector Strategy (Priority Order)
1. Semantic HTML attributes (`[type="submit"]`, `[name="email"]`)
2. Stable class names from PrestaShop's own CSS (`.product-miniature`, `.blockcart`)
3. ARIA roles (not widely used in PrestaShop 8)
4. Text content (last resort, brittle with i18n)

---

## 5. Coverage Priority

### P1 – Must Pass (business-critical paths)
- Login with valid credentials
- Search returns results
- Add product to cart
- Cart updates (count, subtotal)
- Checkout page reachable

### P2 – Should Pass (important UX)
- Homepage loads correct title and elements
- Category filtering and sorting
- PDP quantity controls
- My Account navigation
- Logout and re-login

### P3 – Nice to Pass (edge cases / UI details)
- Newsletter validation
- Social links present
- Breadcrumb accuracy
- No-results message display

---

## 6. Risk-Based Prioritization

High-risk areas get more test cases and stricter assertions:

| Area | Risk | Reason |
|------|------|--------|
| Authentication | High | Gate to all account features; shared demo credentials |
| Cart / Checkout | High | Revenue-critical path; complex state |
| Search | Medium | High usage; result consistency depends on demo data |
| Homepage | Medium | First impression; many locators may shift with theme updates |
| My Account | Low | Mostly navigation; read-only for this demo |

---

## 7. Negative Testing

Negative cases are included where the UI provides feedback:

- Login with wrong password → error alert
- Empty form submission → browser validation
- Invalid promo code → error message
- Non-email in newsletter → browser `validity.valid = false`
- Search with nonsense term → 0 results

Checkout past payment is excluded — the demo restricts real order placement.

---

## 8. Known Constraints and Decisions

| Constraint | Decision |
|-----------|----------|
| Demo resets periodically | Tests are stateless; they create their own cart items and don't depend on pre-existing orders |
| Shared pub@prestashop.com account | Acceptable for read/write tests; registration tests use unique `Date.now()` email |
| No API access | All assertions are DOM-based |
| Cloudflare bot protection | Auth cookies stored in `global.setup.ts` to pass CF session checks |
| Ephemeral demo URLs | Dynamic URL resolution on each run via iframe detection in global setup |

---

## 9. Definition of Done

A test is considered complete when:
1. It has a unique TC-ID matching `TestCases.md`
2. It uses a POM method or locator — no raw `page.locator()` in spec files for repeated elements
3. It includes at least one `expect()` assertion
4. It passes on a live demo instance without retries
