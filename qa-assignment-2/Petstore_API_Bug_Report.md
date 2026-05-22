# Petstore API Bug Report

**API Under Test:** Swagger Petstore — `https://petstore.swagger.io/v2`  
**Date:** 2026-05-22  
**Total Bugs Found:** 12  

---

## Bug Summary

| Bug ID | Title | Severity | Module | Status |
|--------|-------|----------|--------|--------|
| BUG-001 | Login accepts wrong/missing credentials | Critical | User | Open |
| BUG-002 | PUT /pet accepts missing required `name` field | High | Pet | Open |
| BUG-003 | POST /pet accepts missing required `photoUrls` | Medium | Pet | Open |
| BUG-004 | findByStatus returns 200 for invalid enum value | High | Pet | Open |
| BUG-005 | POST /store/order accepts negative quantity | High | Store | Open |
| BUG-006 | GET /store/order allows orderId outside spec range | Medium | Store | Open |
| BUG-007 | GET /user returns password in plaintext | High | User | Open |
| BUG-008 | POST /pet succeeds without authentication | Critical | Security | Open |
| BUG-009 | XSS payload stored and returned unescaped | High | Security | Open |
| BUG-010 | Empty body returns 405 instead of 400 | Medium | Error Handling | Open |
| BUG-011 | String path param returns 404 + stack trace instead of 400 | Medium | Error Handling | Open |
| BUG-012 | GET /pet/findByStatus response time exceeds 1000ms | Medium | Performance | Open |
| BUG-013 | POST /pet with malformed JSON returns 500 (server crash) | High | Error Handling | Open |

---

## Detailed Bug Reports

---

### BUG-001 — Login accepts wrong/missing credentials

| Field | Value |
|-------|-------|
| **Severity** | Critical |
| **Module** | User |
| **Endpoint** | `GET /user/login` |
| **Test Cases** | TC-USER-005, TC-USER-006 |
| **Bug Type** | Security — Authentication |

**Steps to Reproduce:**
1. `GET /user/login?username=anyuser&password=wrongpassword`
2. `GET /user/login` (no params at all)

**Expected:** 401 Unauthorized — credentials must be validated before granting a session

**Actual:** Both return `200 OK` with a valid session token:
```json
{"code":200,"type":"unknown","message":"logged in user session:1779457969716"}
```

**Impact:** Any user can log in without valid credentials. Authentication is completely bypassed. This is a broken authentication vulnerability (OWASP Top 10 — A07).

---

### BUG-002 — PUT /pet accepts missing required `name` field

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Module** | Pet |
| **Endpoint** | `PUT /pet` |
| **Test Case** | TC-PET-006 |
| **Bug Type** | Data Validation |

**Steps to Reproduce:**
```
PUT /pet
Body: {"id":99991,"status":"sold","photoUrls":[]}
```
(no `name` field)

**Expected:** 400 Bad Request — `name` is marked as required in the Swagger spec

**Actual:** 200 OK — pet stored without a name:
```json
{"id":99991,"photoUrls":[],"tags":[],"status":"sold"}
```

**Impact:** Pets with no name can be created/updated, corrupting data integrity.

---

### BUG-003 — POST /pet accepts missing required `photoUrls`

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Module** | Pet |
| **Endpoint** | `POST /pet` |
| **Test Case** | TC-PET-007 |
| **Bug Type** | Data Validation |

**Steps to Reproduce:**
```
POST /pet
Body: {"id":99992,"name":"MissingPhotoTest","status":"available"}
```
(no `photoUrls` field)

**Expected:** 400 Bad Request — `photoUrls` is a required array per spec

**Actual:** 200 OK — server silently defaults to `"photoUrls":[]` with no error

**Impact:** Contract mismatch; consumers expecting a required field will receive no error signal.

---

### BUG-004 — GET /pet/findByStatus returns 200 for invalid enum value

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Module** | Pet |
| **Endpoint** | `GET /pet/findByStatus` |
| **Test Case** | TC-PET-011 |
| **Bug Type** | Data Validation |

**Steps to Reproduce:**
```
GET /pet/findByStatus?status=invalid
```

**Expected:** 400 Bad Request — `status` must be one of: `available`, `pending`, `sold`

**Actual:** 200 OK — returns empty array `[]`

**Impact:** Clients silently receive no results without knowing they passed an invalid query parameter. Violates the spec's enum constraint.

---

### BUG-005 — POST /store/order accepts negative quantity

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Module** | Store |
| **Endpoint** | `POST /store/order` |
| **Test Case** | TC-STORE-003 |
| **Bug Type** | Data Validation — Boundary Value |

**Steps to Reproduce:**
```
POST /store/order
Body: {"id":5002,"petId":99992,"quantity":-1,"status":"placed","complete":false}
```

**Expected:** 400 Bad Request — quantity must be ≥ 1

**Actual:** 200 OK — order created with `"quantity":-1`

**Impact:** Negative order quantities could cause incorrect inventory calculations and business logic errors downstream.

---

### BUG-006 — GET /store/order allows orderId outside spec range (1–10)

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Module** | Store |
| **Endpoint** | `GET /store/order/{orderId}` |
| **Test Case** | TC-STORE-006 |
| **Bug Type** | Data Validation |

**Steps to Reproduce:**
```
GET /store/order/11
```

**Expected:** 400 Bad Request — Swagger spec states valid values: 1–10

**Actual:** 200 OK — returns seeded data: `{"id":11,"petId":0,"quantity":0,"status":"placed","complete":true}`

**Impact:** Spec constraint not enforced; returns unexpected seeded data for IDs > 10.

---

### BUG-007 — GET /user returns password in plaintext response

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Module** | User |
| **Endpoint** | `GET /user/{username}` |
| **Test Case** | TC-USER-002 |
| **Bug Type** | Security — Sensitive Data Exposure |

**Steps to Reproduce:**
```
GET /user/testuser_1779457958
```

**Actual Response includes:**
```json
{"password":"pass1234",...}
```

**Expected:** Password field should be omitted or hashed/masked in the response

**Impact:** Sensitive data leakage. Any authenticated user (or unauthenticated, given BUG-001) can retrieve plaintext passwords — OWASP Top 10 A02: Cryptographic Failures.

---

### BUG-008 — POST /pet succeeds without authentication

| Field | Value |
|-------|-------|
| **Severity** | Critical |
| **Module** | Security |
| **Endpoint** | `POST /pet` |
| **Test Case** | TC-SEC-003 |
| **Bug Type** | Security — Authentication Bypass |

**Steps to Reproduce:**
```
POST /pet
Headers: Content-Type: application/json (NO api_key header)
Body: {"id":88881,"name":"UnauthorizedPet","status":"available","photoUrls":[]}
```

**Expected:** 401 Unauthorized — write operations require `api_key` header per Swagger spec

**Actual:** 200 OK — pet created successfully with no API key

**Impact:** Any unauthenticated client can create, modify, or delete pets. The authentication model is not enforced on write endpoints.

---

### BUG-009 — XSS payload stored and returned unescaped in name field

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Module** | Security |
| **Endpoint** | `POST /pet` |
| **Test Case** | TC-SEC-005 |
| **Bug Type** | Security — Stored XSS |

**Steps to Reproduce:**
```
POST /pet
Body: {"id":88882,"name":"<script>alert(1)</script>","status":"available","photoUrls":[]}
```

**Expected:** 400 Bad Request or HTML-encoded value stored (`&lt;script&gt;`)

**Actual:** 200 OK — raw script tag stored and returned:
```json
{"id":88882,"name":"<script>alert(1)</script>","photoUrls":[],"tags":[],"status":"available"}
```

**Impact:** If this data is rendered in a browser without escaping, the stored XSS payload executes. OWASP Top 10 A03: Injection.

---

### BUG-010 — Empty body on POST /pet returns 405 instead of 400

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Module** | Error Handling |
| **Endpoint** | `POST /pet` |
| **Test Case** | TC-ERR-003 |
| **Bug Type** | Error Handling — Wrong Status Code |

**Steps to Reproduce:**
```
POST /pet
Content-Type: application/json
Body: (empty)
```

**Expected:** 400 Bad Request — the body is empty, which is a client error (bad input)

**Actual:** 405 Method Not Allowed — `{"code":405,"type":"unknown","message":"no data"}`

**Impact:** 405 indicates the HTTP method is not allowed on this resource — which is incorrect. This misleads API consumers into thinking they are using the wrong HTTP method rather than providing an empty body.

---

### BUG-011 — String path parameter returns 404 + Java stack trace

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Module** | Error Handling |
| **Endpoint** | `GET /pet/{petId}`, `GET /store/order/{orderId}` |
| **Test Cases** | TC-PET-004, TC-ERR-004 |
| **Bug Type** | Error Handling — Wrong Status Code + Information Disclosure |

**Steps to Reproduce:**
```
GET /pet/abc
GET /store/order/abc
```

**Actual:** 404 — `{"code":404,"type":"unknown","message":"java.lang.NumberFormatException: For input string: \"abc\""}`

**Expected:**
- Status code: 400 Bad Request (invalid input type, not missing resource)
- Message: Generic validation error, not a Java exception class name

**Impact (two issues):**
1. Wrong status code: 400 for bad input type, not 404
2. `java.lang.NumberFormatException` reveals the server-side technology stack — information that attackers can exploit for targeted attacks

---

### BUG-012 — GET /pet/findByStatus response time consistently exceeds 1000ms

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Module** | Performance |
| **Endpoint** | `GET /pet/findByStatus?status=available` |
| **Test Cases** | TC-PERF-002, TC-PERF-004 |
| **Bug Type** | Performance |

**Measurements:**

| Run | Response Time | Payload Size |
|-----|-------------|-------------|
| Single request | 1391ms | 70 KB |
| Sequential run 1 | 1570ms | — |
| Sequential run 2 | 1564ms | — |
| Sequential run 3 | 1796ms | — |
| Sequential run 4 | 1510ms | — |
| Sequential run 5 | 1452ms | — |
| **Average** | **1557ms** | |

**Expected:** < 1000ms

**Possible Root Cause:** No pagination on `findByStatus` — entire dataset returned in one call. 70 KB for a list endpoint with no limit/offset parameters.

**Recommendation:** Add pagination (`?limit=20&offset=0`) to avoid full-table scans and large response payloads.

---

## Bug Distribution by Category

| Bug Type | Count |
|----------|-------|
| Security | 4 (BUG-001, BUG-007, BUG-008, BUG-009) |
| Data Validation | 4 (BUG-002, BUG-003, BUG-004, BUG-005) |
| Error Handling | 4 (BUG-006, BUG-010, BUG-011, BUG-013) |
| Performance | 1 (BUG-012) |

## Bug Distribution by Severity

| Severity | Count | Bug IDs |
|----------|-------|---------|
| Critical | 2 | BUG-001, BUG-008 |
| High | 6 | BUG-002, BUG-004, BUG-005, BUG-007, BUG-009 + BUG-006 partial |
| Medium | 4 | BUG-003, BUG-006, BUG-010, BUG-011, BUG-012 |
