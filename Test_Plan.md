# Artifact 2 — Test Plan
## B2B Vendor Invoice Management Portal

**Phase:** System Testing  
**Testing Window:** 4 Weeks

---

## Entry Criteria

- All P0/P1 defects from previous phase resolved
- Staging environment stable and seeded with test data
- API documentation finalized
- Test cases reviewed and signed off by QA Lead

---

## Exit Criteria

- All planned test cases executed
- Zero open Critical or High severity defects
- Functional coverage ≥ 90% for all in-scope requirements
- Performance baseline met: ≤ 2s response time at 500 concurrent users
- QA Lead sign-off obtained

---

## Test Environment

| Component | Detail |
|-----------|--------|
| Server | Staging (production-like configuration) |
| Payment Gateway | Mock — returns success / 503 on demand |
| Email Service | Mailtrap sandbox (captures outbound emails) |
| Database | Seeded with vendor accounts, POs, and invoice history |
| User Roles | All roles configured: Vendor, AP Clerk, AP Manager, Admin |

---

## Test Schedule

| Week | Focus Area |
|------|-----------|
| Week 1 | Registration, Login, Session management, RBAC |
| Week 2 | Invoice submission, PO validation, file upload, duplicate detection |
| Week 3 | AP workflow, payment integration, email notifications |
| Week 4 | Reports, security testing, performance, regression |

---

## Defect Severity Definitions

| Severity | Definition | Example |
|----------|-----------|---------|
| Critical | System crash, data loss, security breach, financial error | Duplicate payment forwarded |
| High | Core feature broken, no workaround available | Invoice cannot be submitted |
| Medium | Feature broken, workaround exists | Filter on AP dashboard not working |
| Low | Cosmetic or minor UX issue | Button misaligned on mobile |

---

## Defect Priority Definitions

| Priority | Meaning |
|----------|---------|
| P1 | Fix before testing can continue (blocker) |
| P2 | Fix within current sprint |
| P3 | Fix in next sprint |
| P4 | Fix eventually / backlog |

---

## Assumptions & Constraints

- Mock payment gateway must be configured before Week 3 testing begins
- Client AP team available for UAT in final week
- Email sandbox (Mailtrap) accessible from staging environment
- No production data will be used during testing
