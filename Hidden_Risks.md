# Artifact 7 — Hidden Risks
## B2B Vendor Invoice Management Portal

> These are risks not visible in the requirements text — the kind that only surface in production if QA doesn't ask the right questions first.

---

### Risk 1: Double Payment via Retry (REQ-04)

**What:** If the payment API call succeeds but the HTTP response times out before the portal receives it, the system may retry the same call — forwarding the invoice twice.

**Why it's hidden:** The requirement only says "forward for payment processing." Idempotency is never mentioned.

**Mitigation:** Every payment forwarding request must include a unique idempotency key. The payment system should reject or ignore a duplicate key on retry.

---

### Risk 2: IDOR — Insecure Direct Object Reference (REQ-07)

**What:** A vendor could guess or enumerate invoice IDs in the URL (`/invoice/1001`, `/invoice/1002`) and read another vendor's data, even if the UI hides the link.

**Why it's hidden:** The requirement says "only authorized users access the system" but says nothing about per-resource ownership checks.

**Mitigation:** Every API endpoint must enforce server-side ownership validation — not just "is the user logged in?" but "does this user own this resource?"

---

### Risk 3: Over-Invoicing / No PO Balance Guard (REQ-02)

**What:** No requirement explicitly prevents a vendor from submitting an invoice for more than the PO value. An AP user approving without noticing could authorize an inflated payment.

**Why it's hidden:** The requirement says "submit invoices against purchase orders" — "against" implies a relationship, but no validation rule is stated.

**Mitigation:** Hard validation at submission: invoice amount must not exceed remaining PO balance. Flag as a clarifying question (see `01_Clarifying_Questions.md`).

---

### Risk 4: Concurrent Approval Race Condition (REQ-03)

**What:** Two AP users open the same invoice simultaneously. Both click "Approve." Both requests reach the server within milliseconds. Payment is forwarded twice.

**Why it's hidden:** Single-user testing would never reveal this. It only appears under multi-user load or when two AP staff work simultaneously.

**Mitigation:** Optimistic locking — before committing an approval, the server checks that the invoice state has not changed since it was last read. If it has, the second approval is rejected.

---

### Risk 5: Email Spoofing and Deliverability (REQ-05)

**What:** Without SPF, DKIM, and DMARC records on the sending domain, notification emails may land in spam — or worse, attackers may spoof the sending domain in phishing emails targeting vendors.

**Why it's hidden:** The requirement only says "email notifications." Email infrastructure hygiene is assumed, never stated.

**Mitigation:** Verify SPF/DKIM/DMARC configuration as part of the go-live checklist. Test with a deliverability tool (e.g., mail-tester.com).

---

### Risk 6: Unauthorized Report Access (REQ-06)

**What:** Monthly reports aggregate all vendors' financial data. If the report endpoint only checks authentication (not role), any logged-in vendor could download a report revealing competitor invoice volumes and payment terms.

**Why it's hidden:** REQ-07 says "only authorized users" but doesn't say which roles are authorized for reports. REQ-06 says nothing about access control.

**Mitigation:** Role-based access enforced at the API layer for every report endpoint. Vendors accessing `/reports` should receive 403.

---

### Risk 7: Malicious File Upload (REQ-02)

**What:** Accepting file uploads without (a) validating true MIME type beyond the file extension, and (b) running antivirus/malware scanning is a server-side attack vector. A `.pdf`-renamed `.exe` or a macro-embedded Excel file could be stored on the server and potentially executed downstream.

**Why it's hidden:** The requirement says "submit invoices" — file upload security is an implementation concern, not a business requirement. Easy to forget.

**Mitigation:** Server-side MIME type validation (not just extension check); integrate antivirus scanning (e.g., ClamAV) on every upload before the file is stored.
