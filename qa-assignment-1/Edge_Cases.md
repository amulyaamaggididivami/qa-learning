# Artifact 6 — Edge Cases
## B2B Vendor Invoice Management Portal

> Edge cases are the scenarios "no one thought to mention" in the requirements.  
> Great QA finds them before production does.

---

| ID | Edge Case | Risk Level | Requirement |
|----|-----------|------------|-------------|
| EC-01 | Vendor submits invoice with ₹0.00 amount | High | REQ-02 |
| EC-02 | Invoice submitted against a PO that was cancelled after submission | High | REQ-02 |
| EC-03 | Two AP users attempt to approve the same invoice simultaneously | Critical | REQ-03 |
| EC-04 | Invoice amount exceeds remaining PO balance (over-invoicing) | High | REQ-02 |
| EC-05 | Vendor account deactivated while their invoice is in "Pending Approval" | Medium | REQ-03 |
| EC-06 | AP user session expires mid-approval (form data lost?) | Medium | REQ-03 |
| EC-07 | Network retry causes payment to be forwarded twice to payment system | Critical | REQ-04 |
| EC-08 | Email notification sent to invalid/bounced address | Medium | REQ-05 |
| EC-09 | Monthly report generated for a month with zero invoice activity | Low | REQ-06 |
| EC-10 | Vendor uploads a password-protected or encrypted PDF | Medium | REQ-02 |
| EC-11 | Vendor submits invoice in a foreign currency when only INR is configured | High | REQ-02 |
| EC-12 | Report generation triggered while month-end batch job is already running | Medium | REQ-06 |
| EC-13 | SQL injection payload in Invoice Number or Vendor Name field | Critical | REQ-07 |
| EC-14 | XSS payload in rejection reason or comment fields | Critical | REQ-07 |
| EC-15 | Uploaded invoice file contains malware (EICAR test file) | Critical | REQ-02 |
| EC-16 | Vendor submits 100 invoices simultaneously (bulk load) | High | REQ-02 |
| EC-17 | Same PO number referenced by two different vendors | High | REQ-02 |

---

## Why These Matter

**EC-03 (Concurrent Approval):** Classic race condition. Without optimistic locking, two AP users can approve simultaneously, triggering double payment. The fix is to check-and-set invoice state in a single atomic DB transaction.

**EC-07 (Double Payment):** A successful payment API call with a timed-out response causes a retry, and the same invoice is forwarded twice. Idempotency keys on the payment API are the only reliable prevention.

**EC-13 / EC-14 (Injection):** User-supplied text going into a database query or rendered in HTML without sanitization. These are OWASP Top 10 — they must be tested at every text input field.

**EC-15 (Malware Upload):** A vendor uploads a `.pdf`-renamed `.exe`. Without MIME type validation and antivirus scanning, the file lands on the server and potentially gets executed downstream.
