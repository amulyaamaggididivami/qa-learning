# Artifact 1 — Test Strategy
## B2B Vendor Invoice Management Portal

**Version:** 1.0  
**Date:** May 2026

---

## 1. Scope

### In Scope
- Vendor registration, login, session management
- Invoice submission, validation, and lifecycle
- AP approval / rejection / on-hold workflow
- Payment system integration
- Email notification engine
- Monthly report generation
- Role-based access control (RBAC)
- Security: authentication, authorization, injection, file upload safety

### Out of Scope
- Internal workings of the payment gateway
- Internal ERP/SAP processing
- Third-party email delivery infrastructure

---

## 2. Testing Approach

- **Shift-left:** QA reviews requirements before development; ambiguities flagged in writing
- **API-first:** Backend API logic tested independently of the UI using Postman
- **Risk-based prioritization:** Payment flows, auth, and duplicate prevention tested first
- **Regression:** Automated regression suite runs after every sprint merge
- **UAT:** Client's AP team validates business workflows before go-live

---

## 3. Testing Types

| Type | Purpose | Tool |
|------|---------|------|
| Functional | Verify all requirements | Manual + Cypress |
| API | Invoice / PO / Payment APIs | Postman / Newman |
| Security | Auth bypass, IDOR, injection, file upload | OWASP ZAP, manual |
| Performance | Load with 500–1000 concurrent users | JMeter / k6 |
| Integration | Payment system, email service, ERP | Postman + sandboxes |
| Regression | Post-fix safety net | Cypress automated suite |
| UAT | Business validation | Client AP team (manual) |

---

## 4. Risk Register (Priority Order)

| # | Risk | Impact | Mitigation |
|---|------|--------|-----------|
| 1 | Duplicate payment forwarding | Financial, critical | Idempotency keys on payment API |
| 2 | Authorization bypass / IDOR | Data breach | Server-side auth check on every request |
| 3 | Over-invoicing (invoice > PO value) | Financial | Validation at submission |
| 4 | Concurrent approval race condition | Double payment | Optimistic locking on invoice state |
| 5 | Email notification failure | Compliance, vendor trust | Retry queue + delivery monitoring |
| 6 | Malicious file upload | Server compromise | Antivirus scan + MIME type validation |
| 7 | Report unauthorized access | Data privacy | Role checks on report endpoints |

---

## 5. Roles & Responsibilities

| Role | Responsibility |
|------|---------------|
| QA Lead | Strategy, sign-off, risk decisions |
| QA Engineer | Test case design, execution, defect reporting |
| Developer | Unit tests, API contracts, defect fixes |
| Client AP Team | UAT execution, acceptance sign-off |
| DevOps | Environment setup, deployment, mock services |
