# Petstore API Bug Report

**API Under Test:** Swagger Petstore — `https://petstore.swagger.io/v2`  
**Date:** 2026-05-23 (updated after PDF gap analysis)  
**Total Bugs Found:** 23  

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
| BUG-014 | POST /pet with duplicate ID returns 200 instead of 409 | High | Pet | Open |
| BUG-015 | PUT /pet with non-existent ID creates resource instead of 404 | High | Pet | Open |
| BUG-016 | POST /pet returns 200 instead of 201 + no Location header | Medium | Pet | Open |
| BUG-017 | DELETE /pet returns 200 with body instead of 204 No Content | Medium | Pet | Open |
| BUG-018 | POST /user with duplicate username returns 200 instead of 409 | High | User | Open |
| BUG-019 | POST /store/order accepts invalid status enum value | High | Store | Open |
| BUG-020 | PUT /user with non-existent username creates resource instead of 404 | High | User | Open |
| BUG-021 | Missing security response headers (X-Frame-Options, HSTS, etc.) | Medium | Security | Open |
| BUG-022 | Server version disclosed in response header | Medium | Security | Open |
| BUG-023 | Error responses return text/html instead of application/json | Medium | Error Handling | Open |

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

---

### BUG-014 — POST /pet with duplicate ID returns 200 instead of 409

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Module** | Pet |
| **Endpoint** | `POST /pet` |
| **Test Case** | TC-PET-015 |
| **Bug Type** | Data Validation — Conflict Detection |

**Steps to Reproduce:**
```
POST /pet  Body: {"id":11111,"name":"FirstPet","status":"available","photoUrls":[]}
POST /pet  Body: {"id":11111,"name":"DuplicatePet","status":"pending","photoUrls":[]}
```

**Expected:** 409 Conflict on second POST — resource with id=11111 already exists

**Actual:** 200 OK — second POST silently overwrites the first pet

**Impact:** Data integrity broken. Any client can silently overwrite another pet by knowing its ID. No conflict protection.

---

### BUG-015 — PUT /pet with non-existent petId creates resource (upsert behavior)

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Module** | Pet |
| **Endpoint** | `PUT /pet` |
| **Test Case** | TC-PET-016 |
| **Bug Type** | Functional — Wrong Behavior on Non-existent Resource |

**Steps to Reproduce:**
```
PUT /pet  Body: {"id":9876543,"name":"Ghost","status":"available","photoUrls":[]}
(pet id 9876543 does not exist)
```

**Expected:** 404 Not Found — PUT should update an existing resource, not create one

**Actual:** 200 OK — pet is created with a new ID

**Impact:** PUT behaves as UPSERT, creating data unintentionally. Breaks the REST contract where PUT means "replace existing."

---

### BUG-016 — POST /pet returns 200 instead of 201 + no Location header

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Module** | Pet |
| **Endpoint** | `POST /pet` |
| **Test Case** | TC-PET-017 |
| **Bug Type** | REST Convention Violation |

**Steps to Reproduce:**
```
POST /pet  Body: {"id":22221,"name":"HeaderTest","status":"available","photoUrls":[]}
Inspect response headers and status code
```

**Expected:** 201 Created + `Location: /pet/22221` header (per REST standard — course slide: "POST: Status 201 + Location header")

**Actual:** 200 OK, no Location header

**Observed headers:**
```
content-type: application/json
access-control-allow-origin: *
```

**Impact:** Clients relying on 201 to detect resource creation or on the Location header to find the created resource will fail. Violates REST idiomatic behavior documented in the course.

---

### BUG-017 — DELETE /pet returns 200 with body instead of 204 No Content

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Module** | Pet |
| **Endpoint** | `DELETE /pet/{petId}` |
| **Test Case** | TC-PET-018 |
| **Bug Type** | REST Convention Violation |

**Steps to Reproduce:**
```
DELETE /pet/99991
```

**Expected:** 204 No Content with empty body (per REST standard — course slide: "DELETE: Status 204 (No Content)")

**Actual:** 200 OK with body `{"code":200,"type":"unknown","message":"99991"}`

**Impact:** Clients checking for 204 to confirm deletion will misinterpret the response. Returning a body with 200 is non-standard for a delete operation.

---

### BUG-018 — POST /user with duplicate username returns 200 instead of 409

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Module** | User |
| **Endpoint** | `POST /user` |
| **Test Case** | TC-USER-012 |
| **Bug Type** | Data Validation — Conflict Detection |

**Steps to Reproduce:**
```
POST /user  Body: {"id":33331,"username":"dupuser_test",...}
POST /user  Body: {"id":33332,"username":"dupuser_test",...}  (same username)
```

**Expected:** 409 Conflict — username must be unique

**Actual:** 200 OK for both — duplicate username accepted silently

**Impact:** Two users can share the same username, breaking user identity uniqueness. Combined with BUG-001 (auth bypass), any username can be re-registered.

---

### BUG-019 — POST /store/order accepts invalid order status enum value

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Module** | Store |
| **Endpoint** | `POST /store/order` |
| **Test Case** | TC-STORE-009 |
| **Bug Type** | Data Validation — Enum Validation |

**Steps to Reproduce:**
```
POST /store/order
Body: {"id":44442,"petId":1,"quantity":1,"status":"INVALID_STATUS","complete":false}
```

**Expected:** 400 Bad Request — `status` must be one of: `placed`, `approved`, `delivered`

**Actual:** 200 OK — order created with `"status":"INVALID_STATUS"`

**Impact:** Orders with invalid statuses can corrupt order state machines downstream. Any string value is accepted for the `status` field.

---

### BUG-020 — PUT /user with non-existent username creates user instead of 404

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Module** | User |
| **Endpoint** | `PUT /user/{username}` |
| **Test Case** | TC-USER-013 |
| **Bug Type** | Functional — Wrong Behavior on Non-existent Resource |

**Steps to Reproduce:**
```
PUT /user/nonexistent_user_xyz_99
Body: valid user object
```

**Expected:** 404 Not Found — cannot update a user that doesn't exist

**Actual:** 200 OK — user created (upsert behavior)

**Impact:** Same as BUG-015. PUT behaves as UPSERT, violating REST semantics.

---

### BUG-021 — Missing security response headers

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Module** | Security |
| **Endpoint** | All endpoints |
| **Test Case** | TC-HDR-003 |
| **Bug Type** | Security — Missing Security Headers |

**Headers checked, all absent:**

| Header | Purpose | Status |
|--------|---------|--------|
| `X-Frame-Options` | Prevent clickjacking | **Missing** |
| `X-Content-Type-Options: nosniff` | Prevent MIME sniffing | **Missing** |
| `Strict-Transport-Security` | Enforce HTTPS | **Missing** |
| `Content-Security-Policy` | Restrict resource loading | **Missing** |

**Actual headers returned:**
```
content-type: application/json
access-control-allow-origin: *
access-control-allow-methods: GET, POST, DELETE, PUT
access-control-allow-headers: Content-Type, api_key, Authorization
server: Jetty(9.2.9.v20150224)
```

**Impact:** Without X-Frame-Options, the API responses can be embedded in iframes for clickjacking. Without X-Content-Type-Options, browsers may MIME-sniff responses. These are standard security headers recommended in OWASP guidelines.

---

### BUG-022 — Server version disclosed in response header

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Module** | Security |
| **Endpoint** | All endpoints |
| **Test Case** | TC-HDR-004 |
| **Bug Type** | Security — Information Disclosure |

**Actual:**
```
server: Jetty(9.2.9.v20150224)
```

**Expected:** Server header absent or generic

**Impact:** Exposes server type (Jetty) and exact version (9.2.9, released 2015). Attackers can look up known CVEs for that specific version. Jetty 9.2.9 is over 10 years old and likely has published vulnerabilities.

---

### BUG-023 — 404 error responses return text/html instead of application/json

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Module** | Error Handling |
| **Endpoint** | `GET /pet/1` (non-existent on demo server) |
| **Test Case** | TC-HDR-005 |
| **Bug Type** | Error Handling — Inconsistent Content-Type |

**Steps to Reproduce:**
```
GET /pet/1   (pet ID 1 not present on demo server)
Inspect Content-Type response header
```

**Expected:** `Content-Type: application/json` — all API responses should be JSON

**Actual:** `Content-Type: text/html; charset=ISO-8859-1` — server returns an HTML error page

**Impact:** API clients parsing JSON will crash when they receive HTML. Inconsistent with all other endpoints that return `application/json`. Best practice (per course slide: "Verify Response Headers") is that all responses, including errors, should have consistent Content-Type.

---

## Bug Distribution by Category

| Bug Type | Count | Bug IDs |
|----------|-------|---------|
| Security | 6 | BUG-001, BUG-007, BUG-008, BUG-009, BUG-021, BUG-022 |
| Data Validation | 7 | BUG-002, BUG-003, BUG-004, BUG-005, BUG-014, BUG-018, BUG-019 |
| Error Handling | 5 | BUG-006, BUG-010, BUG-011, BUG-013, BUG-023 |
| Functional / REST Convention | 4 | BUG-015, BUG-016, BUG-017, BUG-020 |
| Performance | 1 | BUG-012 |

## Bug Distribution by Severity

| Severity | Count | Bug IDs |
|----------|-------|---------|
| Critical | 2 | BUG-001, BUG-008 |
| High | 12 | BUG-002, BUG-004, BUG-005, BUG-007, BUG-009, BUG-013, BUG-014, BUG-015, BUG-018, BUG-019, BUG-020 + BUG-003 |
| Medium | 9 | BUG-003, BUG-006, BUG-010, BUG-011, BUG-012, BUG-016, BUG-017, BUG-021, BUG-022, BUG-023 |
