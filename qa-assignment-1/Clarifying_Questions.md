# Part 1 — Ambiguous Requirements & Clarifying Questions
## B2B Vendor Invoice Management Portal

---

### REQ-1: Vendors can register and log in to the portal

**What's ambiguous:** No detail on registration fields, approval workflow, authentication strength, or multi-user vendor accounts.

**Clarifying Questions:**
1. What fields are required during registration (company name, tax/GST ID, bank details, contact person)?
2. Is registration self-service and immediately active, or does an admin approve the vendor first?
3. What password policy should be enforced (minimum length, complexity, expiry interval)?
4. Is Multi-Factor Authentication (MFA) or SSO required?
5. What happens if a vendor tries to register with an email already in the system?
6. Is there a mandatory email verification step before the account is usable?
7. Can one vendor company have multiple portal users (e.g., accounts payable clerk + manager)?
8. What is the session timeout duration? What happens to in-progress work (e.g., a half-filled invoice)?
9. After how many failed login attempts is an account locked, and how is it unlocked?
10. If a vendor account is deactivated, can they re-register, or must an admin reactivate them?

---

### REQ-2: Vendors can submit invoices against purchase orders

**What's ambiguous:** No specification of accepted formats, required fields, PO validation logic, partial invoicing, or duplicate detection.

**Clarifying Questions:**
1. What file formats are accepted for the invoice attachment (PDF only, or also Excel, PNG, TIFF)?
2. What is the maximum file size per submission?
3. What fields must be present on a submitted invoice (invoice number, date, PO number, line items, tax breakdown, total amount)?
4. Is the PO number validated against a database of issued POs, or can a vendor enter any number?
5. Can a vendor submit multiple invoices against the same PO (partial invoicing)?
6. Can a vendor submit multiple file attachments per invoice submission?
7. Can a submitted invoice be edited or withdrawn before AP review begins?
8. What happens if a vendor submits an invoice against a PO that has already been fully paid or cancelled?
9. What defines a duplicate invoice — same invoice number, same PO, same amount, or a combination?
10. Are there currency restrictions? Is multi-currency invoicing supported?
11. Is there a maximum invoice amount? Is there a submission deadline relative to the PO date?
12. Should the system validate that invoice amount does not exceed the remaining PO value?

---

### REQ-3: The AP team can view, approve, or reject invoices

**What's ambiguous:** No definition of AP team roles, approval hierarchy, partial approval, on-hold state, or what happens after rejection.

**Clarifying Questions:**
1. What distinct roles exist within the AP team (AP Clerk, AP Manager, Finance Controller)?
2. Is there a multi-level approval hierarchy — e.g., invoices above a threshold need manager countersignature?
3. Can different AP roles have different permissions (view-only vs. approve/reject)?
4. Is a written reason mandatory when rejecting an invoice?
5. Can an AP user partially approve an invoice (approve some line items, reject others)?
6. Can a rejected invoice be resubmitted by the vendor, or is rejection final?
7. Can approvals be delegated when an approver is on leave?
8. Is there an SLA for invoice approval (e.g., must act within 5 business days)?
9. Can an AP user place an invoice "on hold" pending additional information from the vendor?
10. Can an already-approved invoice be reversed, and if so, by whom and under what conditions?

---

### REQ-4: Approved invoices are forwarded for payment processing

**What's ambiguous:** "Forwarded" is undefined — no integration target, data format, failure handling, or payment status visibility specified.

**Clarifying Questions:**
1. Which downstream payment system receives the forwarded invoice (SAP, Oracle, a bank payment gateway)?
2. What data format does the payment system expect (XML, JSON, CSV, EDI)?
3. Is forwarding automatic on approval, or does it require a manual trigger?
4. What happens if the payment system is unavailable when an invoice is approved — retry logic, queue, alert?
5. Should the portal display payment status updates (e.g., Forwarded → Processing → Paid)?
6. Who is notified when payment forwarding fails?
7. Is there a contractual payment SLA (e.g., payment within 30 days of approval)?
8. Are partial payments supported?

---

### REQ-5: Both parties receive email notifications on status changes

**What's ambiguous:** "Both parties" and "status changes" are vague. No mention of notification templates, fallback behavior, or additional channels.

**Clarifying Questions:**
1. What are all the status transitions that trigger notifications (Submitted, Under Review, Approved, Rejected, Payment Processing, Paid)?
2. Who specifically are "both parties" — the submitting vendor AND which member(s) of the AP team?
3. Should notification emails include invoice details inline, or just a portal link?
4. Are notification templates customizable by the client?
5. What happens if an email bounces or the recipient address is invalid?
6. Are there in-app notifications in addition to email?
7. Should any notifications be copied to additional stakeholders (e.g., Finance Controller on all approvals)?
8. Is there an opt-out or notification preference setting for non-critical alerts?

---

### REQ-6: The system generates monthly invoice activity reports

**What's ambiguous:** Report content, format, audience, generation trigger, and retention are all unspecified.

**Clarifying Questions:**
1. What data must the report include (total invoices submitted/approved/rejected, total value processed, aging analysis, turnaround times)?
2. Who can access reports — AP team only, management, or also vendors (their own data)?
3. In what format should reports be available (PDF, Excel, CSV)?
4. Is the report auto-generated at month-end, or also available on-demand within any date range?
5. Should reports be emailed automatically to designated stakeholders at month-end?
6. How is "monthly" defined — calendar month, or a configurable billing period?
7. Can reports be filtered by vendor, status, date range, or amount?
8. How long must historical reports be retained, and where are they stored?
9. Is there a real-time dashboard in addition to monthly batch reports?

---

### REQ-7: Only authorized users may access the system

**What's ambiguous:** No role definitions, permission matrix, provisioning process, audit requirements, or API authorization model.

**Clarifying Questions:**
1. What are the defined user roles (Vendor, AP Clerk, AP Manager, Finance Controller, System Admin)?
2. What exact permissions does each role have (view, submit, approve, reject, report, user management)?
3. Should a vendor see only their own invoices, or all invoices from their company?
4. Should AP users see all vendor invoices, or only those assigned to them?
5. How are users provisioned — self-registration, admin creation, or import from an identity provider?
6. Should all user actions be audit-logged for compliance (who approved what, when)?
7. Is there an API layer that also requires authorization (OAuth 2.0, API keys)?
8. Are there IP restriction or geofencing requirements for AP team logins?
9. Should the system enforce inactivity logout? After how long?
