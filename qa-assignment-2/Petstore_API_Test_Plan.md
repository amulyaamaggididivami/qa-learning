# Petstore API Test Plan

**API Under Test:** Swagger Petstore  
**Base URL:** `https://petstore.swagger.io/v2`  
**Swagger UI:** https://petstore.swagger.io/#/  
**Date:** 2026-05-23  
**Tester:** Amulya  
**Reference:** 02_API_Testing_Concepts.pptx.pdf  

---

## 1. Objective

Validate all endpoints of the Petstore REST API for correctness, data validation, authentication behavior, error handling, response headers, and performance — aligned with all topics from the API Testing module:

- HTTP method contracts (GET / POST / PUT / DELETE checklist)
- Status code coverage (200, 201, 204, 400, 401, 403, 404, 409, 415, 500)
- Authentication (API Key)
- Swagger spec adherence
- Bug categories: Functional, Data Validation, Security, Performance, Error Handling
- Response header validation (per Best Practices slide)
- REST convention compliance (201 on create, 204 on delete, 409 on conflict)

---

## 2. Scope

| Module | Endpoints | In Scope |
|--------|-----------|----------|
| Pet    | `/pet`, `/pet/{petId}`, `/pet/findByStatus` | Yes |
| Store  | `/store/inventory`, `/store/order`, `/store/order/{orderId}` | Yes |
| User   | `/user`, `/user/{username}`, `/user/login`, `/user/logout` | Yes |
| Response Headers | Content-Type, CORS, security headers, server info | Yes |

**Out of scope:** File upload (`/pet/{petId}/uploadImage`), `createWithArray`, `createWithList`, PATCH (not available on Petstore), GraphQL/SOAP/gRPC (REST focus per course)

---

## 3. PDF Coverage Gap Analysis

This table maps every testable concept from `02_API_Testing_Concepts.pptx.pdf` to our test suite.

| PDF Concept | Slide | Covered? | Test Cases | Notes |
|-------------|-------|----------|-----------|-------|
| GET: 200 + schema + pagination | HTTP Methods | ✅ | TC-PET-002, TC-PET-008–010 | |
| GET: empty/null handled gracefully | HTTP Methods | ✅ | TC-PET-003 | |
| GET: unauthorized returns 401 | HTTP Methods | ✅ | TC-USER-005 | BUG-001 |
| POST: Status **201** + Location header | HTTP Methods | ✅ | TC-PET-017 | BUG-016 — returns 200 |
| POST: Duplicate entry → **409** | HTTP Methods | ✅ | TC-PET-015, TC-USER-012, TC-STORE-009 | BUG-014, BUG-018, BUG-019 |
| POST: Missing required fields → 400 | HTTP Methods | ✅ | TC-PET-006, TC-PET-007 | BUG-002, BUG-003 |
| POST: Response body has generated ID | HTTP Methods | ✅ | TC-PET-001, TC-USER-001 | |
| PUT: 200 or 204 on success | HTTP Methods | ✅ | TC-PET-005, TC-USER-008 | |
| PUT: All fields updated (not partial) | HTTP Methods | ✅ | TC-PET-005, TC-USER-009 | |
| PUT: Non-existent resource → 404 | HTTP Methods | ✅ | TC-PET-016, TC-USER-013 | BUG-015, BUG-020 |
| PUT: Idempotent (same call = same result) | HTTP Methods | ✅ | TC-PET-005 | Verified implicitly |
| DELETE: Status **204** No Content | HTTP Methods | ✅ | TC-PET-018 | BUG-017 — returns 200 |
| DELETE: Resource gone (GET → 404) | HTTP Methods | ✅ | TC-PET-014, TC-USER-011 | |
| DELETE: Already deleted → 404 or 204 | HTTP Methods | ✅ | TC-PET-013, TC-STORE-008 | |
| API Key authentication | Authentication | ✅ | TC-SEC-001 | BUG-008 |
| Auth bypass (no key on write ops) | Authentication | ✅ | TC-SEC-001 | BUG-008 |
| Sensitive data in response | Security Bugs | ✅ | TC-SEC-005 | BUG-007 |
| SQL/script injection not sanitized | Security Bugs | ✅ | TC-SEC-003, TC-SEC-004 | BUG-009 |
| Unauthenticated access allowed | Security Bugs | ✅ | TC-SEC-001 | BUG-008 |
| 500 error on invalid input | Error Handling Bugs | ✅ | TC-ERR-002, TC-ERR-003 | BUG-013, BUG-010 |
| Wrong error code returned | Error Handling Bugs | ✅ | TC-ERR-004, TC-PET-004 | BUG-011 |
| Stack trace exposed to client | Error Handling Bugs | ✅ | TC-PET-004, TC-SEC-003 | BUG-011 |
| Response time > SLA threshold | Performance Bugs | ✅ | TC-PERF-001–004 | BUG-012 |
| Response headers: Content-Type | Best Practices | ✅ | TC-HDR-001 | |
| Response headers: CORS | Best Practices | ✅ | TC-HDR-002 | |
| Response headers: Security (X-Frame-Options, etc.) | Best Practices | ✅ | TC-HDR-003 | BUG-021 |
| Server version not disclosed | Best Practices | ✅ | TC-HDR-004 | BUG-022 |
| Missing required field validation | Data Validation | ✅ | TC-PET-006, TC-PET-007 | BUG-002, BUG-003 |
| Boundary values not enforced | Data Validation | ✅ | TC-STORE-003, TC-STORE-006 | BUG-005, BUG-006 |
| Wrong data type accepted (enum) | Data Validation | ✅ | TC-PET-011, TC-STORE-009 | BUG-004, BUG-019 |
| Swagger spec reading (lock icon = auth) | Swagger | ✅ | TC-SEC-001, TC-SEC-002 | |
| Status codes: 200, 400, 401, 404, 415 | Status Codes | ✅ | Multiple | |
| Status codes: 201, 204 | Status Codes | ✅ | TC-PET-017, TC-PET-018 | BUG-016, BUG-017 |
| Status codes: 409 Conflict | Status Codes | ✅ | TC-PET-015, TC-USER-012 | BUG-014, BUG-018 |
| Use environment variables in Postman | Best Practices | ✅ | Collection variables | Implemented |
| Version control the collection | Best Practices | ✅ | Collection JSON in repo | Implemented |

---

## 4. Test Modules & Coverage

### 4.1 Pet Module (18 test cases)
| Category | Test Cases |
|----------|-----------|
| Happy Path | Create, Read, Update, Delete, Find by valid status |
| Negative | Non-existent ID, invalid string ID, invalid status enum |
| Validation | Missing required name, missing photoUrls, duplicate ID |
| REST Conventions | POST → 201, DELETE → 204, PUT non-existent → 404 |
| Security | POST without API key, XSS payload in name |

### 4.2 Store Module (9 test cases)
| Category | Test Cases |
|----------|-----------|
| Happy Path | Get inventory, create order, get order, delete order |
| Negative | Non-existent order, string ID, already-deleted order |
| Validation | Negative quantity, invalid status enum, orderId range |

### 4.3 User Module (13 test cases)
| Category | Test Cases |
|----------|-----------|
| Happy Path | Create, get, update, delete user |
| Auth | Login valid/invalid/missing, logout |
| Negative | Non-existent user, duplicate username, get/PUT after delete |
| REST Conventions | PUT non-existent → 404 |

### 4.4 Security (5 test cases)
| Category | Test Cases |
|----------|-----------|
| Auth Bypass | DELETE/POST without API key |
| Injection | SQL injection in path param |
| XSS | Script tag in name field |
| Data Exposure | Plaintext password in response |

### 4.5 Error Handling (5 test cases)
| Category | Test Cases |
|----------|-----------|
| Content-Type | Wrong Content-Type → 415 |
| Body Parsing | Malformed JSON, empty body |
| Path Params | String ID for numeric param, integer overflow |

### 4.6 Response Headers (5 test cases — new)
| Category | Test Cases |
|----------|-----------|
| Content-Type | Response Content-Type must be application/json |
| CORS | Access-Control-Allow-Origin present |
| Security Headers | X-Frame-Options, X-Content-Type-Options, HSTS |
| Info Disclosure | Server header must not expose version |
| Error Content-Type | 404 responses must return JSON, not HTML |

### 4.7 Performance (4 test cases)
| Category | Test Cases |
|----------|-----------|
| Response Time | GET /store/inventory, GET /pet/findByStatus, POST /pet |
| Load | 5 sequential requests |

---

## 5. Status Code Coverage

| Status Code | Meaning | Test Cases |
|-------------|---------|-----------|
| 200 | OK | TC-PET-001, TC-PET-002, TC-PET-005, TC-PET-008–010 |
| 201 | Created | TC-PET-017 (FAIL — returns 200) |
| 204 | No Content | TC-PET-018 (FAIL — returns 200) |
| 400 | Bad Request | TC-PET-006, TC-PET-007, TC-ERR-002, TC-ERR-003 |
| 401 | Unauthorized | TC-SEC-001, TC-USER-005 |
| 404 | Not Found | TC-PET-003, TC-PET-013, TC-STORE-005, TC-USER-003 |
| 409 | Conflict | TC-PET-015, TC-USER-012 (FAIL — returns 200) |
| 415 | Unsupported Media Type | TC-ERR-001 |
| 500 | Server Error | TC-ERR-002, TC-ERR-003 (discovered as bugs) |

---

## 6. Authentication Coverage

| Method | Petstore Applies | Tested |
|--------|-----------------|--------|
| API Key (header) | Yes — `api_key: special-key` | ✅ |
| Basic Auth | No | N/A |
| Bearer/JWT | No | N/A |
| OAuth 2.0 | No | N/A |

---

## 7. Entry / Exit Criteria

**Entry:** API is live and Swagger docs are accessible  
**Exit:** All test cases executed, results documented, all PDF concepts mapped

---

## 8. Tools Used

| Tool | Purpose |
|------|---------|
| Postman | Collection authoring, test scripts, environment variables |
| Newman | CLI collection runner |
| curl | Raw request execution and gap verification |
| Swagger UI | Endpoint exploration and schema reference |

---

## 9. Bug Severity Classification

| Severity | Criteria |
|----------|---------|
| Critical | Auth bypass, data exposure, app crash |
| High | Wrong status code, required field not validated, REST convention violation, injection vulnerability |
| Medium | Missing validation, unexpected response format, info disclosure |
| Low | Minor response inconsistency, documentation mismatch |
