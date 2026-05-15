# Artifact 9 — Test Execution Report
## B2B Vendor Invoice Management Portal

**Project:** Vendor Invoice Management Portal  
**Cycle:** System Testing — Week 3  
**Build:** v1.2.3  
**Environment:** Staging  
**Report Date:** 2026-05-15  
**Prepared By:** QA Team

---

## Execution Summary

| Metric | Count |
|--------|-------|
| Total Test Cases Planned | 85 |
| Executed | 62 |
| Passed | 51 |
| Failed | 9 |
| Blocked | 2 |
| Not Yet Executed | 23 |
| **Pass Rate (of executed)** | **82%** |

---

## Coverage by Requirement

| Req ID | Total TCs | Executed | Passed | Failed | Blocked |
|--------|-----------|----------|--------|--------|---------|
| REQ-01 | 10 | 10 | 9 | 1 | 0 |
| REQ-02 | 20 | 18 | 14 | 4 | 0 |
| REQ-03 | 15 | 12 | 10 | 2 | 0 |
| REQ-04 | 7 | 5 | 3 | 0 | 2 |
| REQ-05 | 10 | 10 | 9 | 1 | 0 |
| REQ-06 | 8 | 3 | 3 | 0 | 0 |
| REQ-07 | 15 | 4 | 3 | 1 | 0 |
| **Total** | **85** | **62** | **51** | **9** | **2** |

---

## Defect Summary

| Severity | Count | Open | Closed |
|----------|-------|------|--------|
| Critical | 1 | 1 | 0 |
| High | 4 | 3 | 1 |
| Medium | 3 | 2 | 1 |
| Low | 1 | 0 | 1 |
| **Total** | **9** | **6** | **3** |

---

## Open Critical Issues

| Bug ID | Title | Severity | Priority | Assigned To |
|--------|-------|----------|----------|-------------|
| BUG-007 | Concurrent approval by two AP users triggers duplicate payment forwarding | Critical | P1 | Dev Team |
| BUG-001 | Invoice amount exceeding PO value accepted without error | High | P1 | Dev Team |
| BUG-002 | Rejection reason not included in vendor notification email | Medium | P2 | Dev Team |

---

## Blocker Details

| TC ID | Reason Blocked | Dependency |
|-------|---------------|------------|
| TC-046 to TC-052 | Mock payment gateway not yet configured in staging | DevOps — ETA: 2026-05-17 |

---

## Risks to Completion

- BUG-007 (Critical) must be resolved before UAT can begin
- Payment integration testing (TC-046–052) is blocked; delays Week 3 completion
- REQ-07 security testing only 4/15 cases executed — security pass needed in Week 4

---

## Recommendation

> **Do not proceed to UAT until BUG-007 is resolved and payment integration testing is complete.**

All other open defects are P2/P3 and do not block UAT start, provided BUG-007 and the payment gateway blocker are cleared by 2026-05-17.
