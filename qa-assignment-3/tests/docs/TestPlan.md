# Test Plan – PrestaShop Demo QA Assignment 3

**Project:** PrestaShop Demo End-to-End Testing  
**Application:** https://demo.prestashop.com (ephemeral demo instance)  
**Author:** Amulya  
**Date:** 2026-05-30  
**Tool:** Playwright + TypeScript  

---

## 1. Objective

Validate the core user-facing workflows of the PrestaShop demo storefront through automated end-to-end tests covering 8 functional modules: Homepage, Search, Category, Product Detail, Cart, Authentication, My Account, and Checkout.

---

## 2. Scope

### In Scope
| Module | Coverage |
|--------|----------|
| Homepage | Navigation, product display, search widget, footer |
| Search | Keyword search, no-results, sorting, URL params |
| Category / PLP | Listing, filters, sorting, breadcrumb |
| Product Detail (PDP) | Title, price, image, quantity, add-to-cart |
| Shopping Cart | Add/remove items, totals, promo codes |
| Authentication | Login, logout, registration, validation |
| My Account | Order history, addresses, personal info |
| Checkout | Flow to payment step (no real order placed) |

### Out of Scope
- Payment gateway integration (no real transactions)
- Admin / back-office functionality
- Mobile responsive layout testing
- Performance / load testing
- Email notification verification

---

## 3. Test Environment

| Item | Detail |
|------|--------|
| Application | PrestaShop 8.x demo (https://demo.prestashop.com) |
| Demo URL | Dynamically resolved at run time via global setup |
| Browser | Chromium (Desktop, 1440×900) |
| OS | macOS |
| Runtime | Node.js + Playwright |
| Auth | Session cookies saved once in `tests/.auth/customer.json` |
| Test account | pub@prestashop.com / 123456789 (shared demo account) |

**Constraint:** The demo server spins up ephemeral instances. The URL is resolved dynamically by `global.setup.ts` before each test run and written to `.shopurl`.

---

## 4. Entry Criteria

- `npm install` and `npx playwright install` complete without errors
- `demo.prestashop.com` provisioner is reachable (HTTP 200)
- At least one demo instance is live (global setup resolves a URL)

---

## 5. Exit Criteria

- All 8 test modules executed
- Pass rate ≥ 80% on a live demo instance
- All High-priority test cases pass
- HTML report generated at `playwright-report/`

---

## 6. Test Approach

- **Framework:** Page Object Model (POM) — one class per page in `tests/pages/`
- **Isolation:** `global.setup.ts` runs once before all tests; saves auth state so individual tests skip login
- **Execution order:** Sequential (1 worker) to avoid shared-state conflicts on the demo server
- **Retries:** 0 (failures are reported immediately; flaky demo infra is not masked)
- **Parallelism:** Disabled (`fullyParallel: false`, `workers: 1`)

---

## 7. Test Types

| Type | How |
|------|-----|
| Functional | All 8 spec files, covering happy paths and basic negative cases |
| Negative / Validation | Invalid login, bad promo codes, empty form submission |
| Navigation | URL assertions after clicks, redirects, breadcrumbs |
| UI Presence | Locator visibility checks for critical elements |

---

## 8. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Demo instance goes down mid-run | High | High | Run in serial; re-run if infra fails |
| Shared account state (cart, orders) inconsistent | Medium | Medium | Tests add/remove their own items; don't rely on pre-existing cart state |
| Demo HTML structure changes | Low | High | Locators use semantic selectors; POM isolates locator changes |
| Cloudflare bot challenge blocks headless browser | Medium | High | Auth cookies saved in setup; tests reuse session |
| New user registration email conflicts | Low | Low | `Date.now()` suffix ensures unique email per run |

---

## 9. Test Execution

```bash
# Full run
npx playwright test

# Single module
npx playwright test tests/specs/01_homepage.spec.ts

# Headed (visual debug)
npx playwright test --headed

# HTML report
npx playwright show-report
```

---

## 10. Deliverables

| Artifact | Location |
|----------|----------|
| Test Cases | `tests/docs/TestCases.md` |
| Test Plan | `tests/docs/TestPlan.md` |
| Test Strategy | `tests/docs/TestStrategy.md` |
| Test Data | `tests/docs/TestData.md` |
| Automation source | `tests/specs/`, `tests/pages/` |
| HTML Report | `playwright-report/index.html` |
