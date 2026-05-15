# Artifact 4 — Test Scenarios
## B2B Vendor Invoice Management Portal

> Test scenarios answer **"What to test"** — a user situation or feature area.  
> Detailed "How to test" steps are in `06_Test_Cases.md`.

---

## REQ-01 — Vendor Registration & Login

| ID | Scenario |
|----|----------|
| TS-01 | New vendor registers with all valid fields |
| TS-02 | Registration attempted with an email already in the system |
| TS-03 | Registration with one or more mandatory fields empty |
| TS-04 | Successful vendor login with correct credentials |
| TS-05 | Login with incorrect password |
| TS-06 | Account locked after N consecutive failed login attempts |
| TS-07 | Password reset via "Forgot Password" flow |
| TS-08 | Session expires after inactivity timeout |

---

## REQ-02 — Invoice Submission

| ID | Scenario |
|----|----------|
| TS-09 | Vendor submits a valid invoice with correct PO and all required fields |
| TS-10 | Vendor submits invoice with an invalid / unknown PO number |
| TS-11 | Vendor uploads a file in an unsupported format (e.g., .exe, .docx) |
| TS-12 | Vendor uploads a file exceeding the maximum allowed size |
| TS-13 | Vendor submits a duplicate invoice (same invoice number already in system) |
| TS-14 | Vendor submits an invoice amount exceeding the remaining PO value |
| TS-15 | Vendor edits a submitted invoice before AP review begins |
| TS-16 | Vendor submits an invoice with ₹0.00 amount |

---

## REQ-03 — AP Approval Workflow

| ID | Scenario |
|----|----------|
| TS-17 | AP approves a valid pending invoice |
| TS-18 | AP rejects an invoice with a mandatory reason/comment |
| TS-19 | AP places an invoice on hold pending vendor clarification |
| TS-20 | Multi-level approval triggered for invoice above value threshold |
| TS-21 | AP filters invoice list by status, vendor, and date range |
| TS-22 | AP attempts to approve an already-approved invoice |

---

## REQ-04 — Payment Integration

| ID | Scenario |
|----|----------|
| TS-23 | Approved invoice successfully forwarded to payment system |
| TS-24 | Payment system returns 503 at time of approval — retry behavior verified |
| TS-25 | Portal reflects updated payment status after processing |
| TS-26 | Payment forwarding failure triggers admin alert |

---

## REQ-05 — Email Notifications

| ID | Scenario |
|----|----------|
| TS-27 | Vendor receives confirmation email on invoice submission |
| TS-28 | Vendor receives approval email with invoice details |
| TS-29 | Vendor receives rejection email with reason included |
| TS-30 | AP team receives notification when a new invoice is submitted |
| TS-31 | Both parties notified when invoice status moves to "Payment Processing" |
| TS-32 | Notification to invalid/bounced email address — error handling |

---

## REQ-06 — Monthly Reports

| ID | Scenario |
|----|----------|
| TS-33 | Monthly report generated with correct aggregated data |
| TS-34 | Report filtered and exported by vendor name |
| TS-35 | Report exported as PDF and Excel — format validated |
| TS-36 | Auto-generation trigger fires correctly at month-end |
| TS-37 | Unauthorized user (e.g., Vendor role) is blocked from accessing reports |

---

## REQ-07 — Access Control (RBAC)

| ID | Scenario |
|----|----------|
| TS-38 | Vendor can only view their own company's invoices |
| TS-39 | AP user cannot access vendor account management screens |
| TS-40 | Unauthenticated user is redirected to the login page |
| TS-41 | Vendor accesses AP dashboard URL directly — 403 Forbidden returned |
| TS-42 | Admin creates, edits, and deactivates user accounts |
| TS-43 | Vendor role cannot trigger approve/reject actions via UI or API |
