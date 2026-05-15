# Artifact 3 — Requirements Traceability Matrix (RTM)
## B2B Vendor Invoice Management Portal

> The RTM ensures every requirement has at least one test case, and every test case traces back to a requirement.

---

| Req ID | Requirement | Test Scenarios | Test Case IDs | Priority | Status |
|--------|-------------|----------------|---------------|----------|--------|
| REQ-01 | Vendor registration and login | TS-01 to TS-08 | TC-001 to TC-010 | High | Not Started |
| REQ-02 | Submit invoices against POs | TS-09 to TS-16 | TC-011 to TC-030 | Critical | Not Started |
| REQ-03 | AP team view / approve / reject | TS-17 to TS-22 | TC-031 to TC-045 | Critical | Not Started |
| REQ-04 | Approved invoices forwarded for payment | TS-23 to TS-26 | TC-046 to TC-052 | Critical | Not Started |
| REQ-05 | Email notifications on status changes | TS-27 to TS-32 | TC-053 to TC-062 | High | Not Started |
| REQ-06 | Monthly invoice activity reports | TS-33 to TS-37 | TC-063 to TC-070 | Medium | Not Started |
| REQ-07 | Only authorized users access system | TS-38 to TS-43 | TC-071 to TC-085 | Critical | Not Started |

---

## Coverage Summary

| Priority | Requirement Count | Test Case Range |
|----------|------------------|----------------|
| Critical | 4 (REQ-02, 03, 04, 07) | 55 test cases |
| High | 2 (REQ-01, 05) | 20 test cases |
| Medium | 1 (REQ-06) | 8 test cases |
| **Total** | **7** | **85 test cases** |

---

## How to Update This Matrix

- When a test case is executed, update **Status** to: `In Progress`, `Executed`, or `Blocked`
- When a test case result is known, update **Pass/Fail** column (add column during execution phase)
- If a new requirement is added, assign the next `REQ-XX` ID and a new test scenario block
- Every test case must link to at least one Req ID — orphan test cases are a red flag
