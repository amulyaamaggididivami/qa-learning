# Artifact 5 — Detailed Test Cases
## B2B Vendor Invoice Management Portal

> Test cases answer **"How to test"** — exact steps, data, and expected outcomes.  
> Every test case traces back to a requirement via the RTM (`04_RTM.md`).

---

## TC-001 — Vendor Registration: Happy Path

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-001 |
| **Scenario** | TS-01 |
| **Requirement** | REQ-01 |
| **Priority** | High |
| **Preconditions** | Portal accessible; email "abc@vendor.com" not previously registered |
| **Test Data** | Company: "ABC Supplies", Email: "abc@vendor.com", Password: "Test@1234!", Phone: "+91-9876543210", GST: "27ABCDE1234F1Z5" |
| **Test Steps** | 1. Navigate to `/register` |
| | 2. Fill all fields with the test data above |
| | 3. Click "Register" |
| **Expected Result** | Account created successfully; verification email sent to abc@vendor.com; user redirected to "Verify your email" page |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-002 — Registration with Duplicate Email

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-002 |
| **Scenario** | TS-02 |
| **Requirement** | REQ-01 |
| **Priority** | High |
| **Preconditions** | Account with email "abc@vendor.com" already exists in the system |
| **Test Data** | Email: "abc@vendor.com" (duplicate) |
| **Test Steps** | 1. Navigate to `/register` |
| | 2. Enter email "abc@vendor.com" with any other valid fields |
| | 3. Click "Register" |
| **Expected Result** | Error displayed: "An account with this email already exists. Please log in or use a different email." No new account is created. |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-005 — Login with Incorrect Password

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-005 |
| **Scenario** | TS-05 |
| **Requirement** | REQ-01 |
| **Priority** | High |
| **Preconditions** | Account "abc@vendor.com" exists and is active |
| **Test Data** | Email: "abc@vendor.com", Password: "WrongPass!" |
| **Test Steps** | 1. Navigate to `/login` |
| | 2. Enter email and wrong password |
| | 3. Click "Login" |
| **Expected Result** | Error: "Invalid email or password." User stays on login page. Failed attempt count increments. No account detail revealed in error. |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-009 — Invoice Submission: Happy Path

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-009 |
| **Scenario** | TS-09 |
| **Requirement** | REQ-02 |
| **Priority** | Critical |
| **Preconditions** | Vendor "abc@vendor.com" logged in; PO-100 exists and has ₹1,00,000 remaining balance |
| **Test Data** | Invoice No: "INV-2026-001", PO: "PO-100", Date: 2026-05-01, Amount: ₹50,000, File: invoice.pdf (2 MB, valid PDF) |
| **Test Steps** | 1. Navigate to "Submit Invoice" |
| | 2. Fill all fields with test data |
| | 3. Upload invoice.pdf |
| | 4. Click "Submit" |
| **Expected Result** | Invoice saved with status "Submitted"; confirmation message shown; confirmation email sent to vendor; AP team notified of new invoice |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-013 — Duplicate Invoice Submission

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-013 |
| **Scenario** | TS-13 |
| **Requirement** | REQ-02 |
| **Priority** | Critical |
| **Preconditions** | Vendor logged in; Invoice "INV-2024-001" already submitted against PO-100 |
| **Test Data** | Invoice No: "INV-2024-001", PO: "PO-100", Amount: ₹50,000 |
| **Test Steps** | 1. Navigate to "Submit Invoice" |
| | 2. Enter Invoice No: "INV-2024-001", PO: "PO-100", Amount: ₹50,000 |
| | 3. Upload invoice.pdf |
| | 4. Click "Submit" |
| **Expected Result** | Error: "Invoice INV-2024-001 already exists. Duplicate submissions are not allowed." Invoice is NOT saved. |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-014 — Invoice Amount Exceeds PO Value

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-014 |
| **Scenario** | TS-14 |
| **Requirement** | REQ-02 |
| **Priority** | High |
| **Preconditions** | Vendor logged in; PO-100 has ₹50,000 remaining balance |
| **Test Data** | Invoice Amount: ₹75,000 against PO-100 |
| **Test Steps** | 1. Navigate to "Submit Invoice" |
| | 2. Select PO-100 |
| | 3. Enter Amount: ₹75,000 |
| | 4. Upload valid PDF and click Submit |
| **Expected Result** | Error: "Invoice amount (₹75,000) exceeds PO remaining balance (₹50,000). Submission blocked." |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-017 — AP Approves a Valid Invoice

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-017 |
| **Scenario** | TS-17 |
| **Requirement** | REQ-03 |
| **Priority** | Critical |
| **Preconditions** | AP user logged in with Approve permission; Invoice INV-2026-001 in "Submitted" status |
| **Test Steps** | 1. Navigate to AP Dashboard |
| | 2. Open INV-2026-001 |
| | 3. Review invoice details |
| | 4. Click "Approve" |
| | 5. Confirm in the dialog |
| **Expected Result** | Invoice status → "Approved"; forwarding to payment system triggered; vendor and AP team notified via email |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-018 — AP Rejects Invoice with Reason

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-018 |
| **Scenario** | TS-18 |
| **Requirement** | REQ-03 |
| **Priority** | Critical |
| **Preconditions** | AP user logged in; Invoice INV-2026-002 in "Submitted" status |
| **Test Steps** | 1. Open INV-2026-002 in AP Dashboard |
| | 2. Click "Reject" |
| | 3. Leave reason field **empty** and try to submit → verify error |
| | 4. Enter reason: "PO number mismatch — please resubmit with correct PO-200" |
| | 5. Confirm rejection |
| **Expected Result** | Step 3: Error "Rejection reason is required." Step 5: Invoice status → "Rejected"; vendor receives rejection email including the reason text |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-024 — Payment System Unavailable on Approval

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-024 |
| **Scenario** | TS-24 |
| **Requirement** | REQ-04 |
| **Priority** | Critical |
| **Preconditions** | AP user logged in; Invoice INV-2026-005 in "Submitted" status; payment endpoint mocked to return HTTP 503 |
| **Test Steps** | 1. Open INV-2026-005 in AP Dashboard |
| | 2. Click "Approve" and confirm |
| | 3. Monitor system behavior |
| **Expected Result** | Invoice status → "Approved — Payment Pending"; system retries forwarding (3 attempts, exponential backoff); alert email sent to System Admin; vendor notified "payment is being processed" (no internal error details exposed to vendor) |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-055 — Vendor Receives Rejection Email with Reason

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-055 |
| **Scenario** | TS-29 |
| **Requirement** | REQ-05 |
| **Priority** | High |
| **Preconditions** | Invoice INV-2026-003 rejected by AP with reason "Incorrect tax amount" |
| **Test Steps** | 1. AP rejects INV-2026-003 with reason "Incorrect tax amount" |
| | 2. Check Mailtrap inbox for vendor email abc@vendor.com |
| | 3. Open the received email |
| **Expected Result** | Email received within 2 minutes; subject contains invoice number; body includes rejection reason "Incorrect tax amount" and a link to the portal |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-058 — Notification to Invalid Email Address

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-058 |
| **Scenario** | TS-32 |
| **Requirement** | REQ-05 |
| **Priority** | High |
| **Preconditions** | Vendor registered with email "invalid@@broken.x"; invoice submitted and approved by AP |
| **Test Steps** | 1. AP approves invoice for this vendor |
| | 2. System attempts to send approval notification |
| | 3. Check system logs and admin notification inbox |
| **Expected Result** | Email delivery failure logged; admin receives alert "Notification delivery failed for Vendor ID #123"; invoice approval itself is NOT rolled back |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-063 — Monthly Report Generation

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-063 |
| **Scenario** | TS-33 |
| **Requirement** | REQ-06 |
| **Priority** | Medium |
| **Preconditions** | AP Manager logged in; at least 5 invoices in various statuses for April 2026 |
| **Test Steps** | 1. Navigate to Reports section |
| | 2. Select period: April 2026 |
| | 3. Click "Generate Report" |
| | 4. Verify report data matches known invoice records |
| **Expected Result** | Report generated showing correct counts (submitted, approved, rejected) and total values for April 2026; data matches source records in the system |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-071 — Vendor Attempts Direct URL Access to AP Dashboard

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-071 |
| **Scenario** | TS-41 |
| **Requirement** | REQ-07 |
| **Priority** | Critical |
| **Preconditions** | User authenticated as Vendor role |
| **Test Steps** | 1. Note AP approval dashboard URL: `/ap/dashboard/approvals` |
| | 2. Enter URL directly in browser address bar while logged in as vendor |
| | 3. Press Enter |
| **Expected Result** | HTTP 403 Forbidden returned; no AP data rendered; error page: "You do not have permission to access this page" |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |

---

## TC-075 — Vendor Cannot Approve via API

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-075 |
| **Scenario** | TS-43 |
| **Requirement** | REQ-07 |
| **Priority** | Critical |
| **Preconditions** | Vendor auth token obtained for abc@vendor.com |
| **Test Steps** | 1. Using Postman, send: `POST /api/invoices/INV-2026-001/approve` with vendor's auth token |
| **Expected Result** | HTTP 403 Forbidden; response body: `{"error": "Insufficient permissions"}` |
| **Actual Result** | *(fill during execution)* |
| **Status** | Not Executed |
