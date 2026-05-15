# QA Assignment — Vendor Invoice Management Portal (B2B)

Assignment based on the **QA Excellence** training session.  
Use case: a B2B portal where vendors submit invoices against purchase orders and an AP team approves or rejects them.

---

## Files

| # | File | What it contains |
|---|------|-----------------|
| 1 | [Clarifying_Questions.md](Clarifying_Questions.md) | Ambiguities identified in each requirement + clarifying questions for the client |
| 2 | [Test_Strategy.md](Test_Strategy.md) | High-level QA approach — scope, testing types, risk register |
| 3 | [Test_Plan.md](Test_Plan.md) | Entry/exit criteria, 4-week schedule, severity & priority definitions |
| 4 | [RTM.md](RTM.md) | Requirements Traceability Matrix — every requirement linked to test scenarios and case IDs |
| 5 | [Test_Scenarios.md](Test_Scenarios.md) | 43 test scenarios covering all 7 requirements (the "what to test") |
| 6 | [Test_Cases.md](Test_Cases.md) | 12 fully written test cases with steps, test data, and expected results |
| 7 | [Edge_Cases.md](Edge_Cases.md) | 17 edge cases with risk levels — scenarios outside the happy path |
| 8 | [Hidden_Risks.md](Hidden_Risks.md) | 7 systemic risks not visible in the requirements (IDOR, race conditions, double payment, etc.) |
| 9 | [Test_Execution_Report.md](Test_Execution_Report.md) | Execution metrics template — pass/fail counts, defect summary, blocker tracking |

---

## Requirements Covered

| Req ID | Requirement |
|--------|-------------|
| REQ-01 | Vendors can register and log in to the portal |
| REQ-02 | Vendors can submit invoices against purchase orders |
| REQ-03 | The AP team can view, approve, or reject invoices |
| REQ-04 | Approved invoices are forwarded for payment processing |
| REQ-05 | Both parties receive email notifications on status changes |
| REQ-06 | The system generates monthly invoice activity reports |
| REQ-07 | Only authorized users may access the system |

---

## QA Lifecycle Phases Applied

1. **Requirements Analysis** → `01_Clarifying_Questions.md`
2. **Test Planning** → `02_Test_Strategy.md`, `03_Test_Plan.md`
3. **Test Design** → `04_RTM.md`, `05_Test_Scenarios.md`, `06_Test_Cases.md`
4. **Risk Identification** → `07_Edge_Cases.md`, `08_Hidden_Risks.md`
5. **Test Execution Tracking** → `09_Test_Execution_Report.md`
