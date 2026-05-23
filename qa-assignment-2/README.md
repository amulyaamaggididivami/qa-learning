# QA Assignment 2 — API Testing: Swagger Petstore

**API Under Test:** [Swagger Petstore](https://petstore.swagger.io/#/)  
**Base URL:** `https://petstore.swagger.io/v2`  
**Reference Material:** `02_API_Testing_Concepts.pptx.pdf`  

---

## Folder Structure

```
qa-assignment-2/
├── README.md                            # This file
├── 02_API_Testing_Concepts.pptx.pdf     # Course reference material
├── Petstore_API_Test_Plan.md            # Scope, approach, modules, severity matrix
├── Petstore_API_Test_Cases.md           # 47 manual test cases with actual results
├── Petstore_API_Bug_Report.md           # 13 bugs with repro steps & impact
└── Petstore_Postman_Collection.json     # Importable Postman collection (45 requests)
```

---

## Running the Postman Collection

### Option 1 — Postman UI (Recommended)

1. Open Postman
2. Click **Import** → select `Petstore_Postman_Collection.json`
3. Open the collection → click **Run collection**
4. All collection variables (`petId`, `orderId`, `username`) are set automatically by pre-request scripts

### Option 2 — Newman (CLI)

```bash
npm install -g newman
newman run Petstore_Postman_Collection.json
```

No environment file needed — all variables are embedded in the collection.

---

## Test Results (Newman Run)

```
Tests:   28 passed  |  16 failed (all [BUG-XXX] tagged — known bugs)
Requests: 45 total
```

| Module | Requests | Pass | Fail (Known Bugs) |
|--------|----------|------|-------------------|
| Pet | 14 | 10 | 4 |
| Store | 8 | 5 | 3 |
| User | 11 | 8 | 3 |
| Security | 5 | 2 | 3 |
| Error Handling | 5 | 3 | 2 |
| **Total** | **45** | **28** | **16** |

> Every failing test name starts with `[BUG-XXX]` and intentionally asserts the *correct* expected behavior against a known bug. They serve as regression tests — they will auto-pass once the bug is fixed.

---

## Understanding the Failures

The collection uses two test styles:

**Happy-path tests** (should always pass):
```javascript
pm.test('Status is 200', () => pm.response.to.have.status(200));
```

**Bug-documentation tests** (intentionally fail until fixed):
```javascript
// BUG-001: Login accepts any password — should return 401
pm.test('[BUG-001] Should return 401 for wrong password', () => {
  pm.expect(pm.response.code).to.equal(401, 'BUG-001: Expected 401 but got ' + pm.response.code);
});
```

When a bug is fixed, the tagged test flips from ✗ to ✓ automatically — no test changes needed.

---

## Bugs Found

| Bug ID | Title | Severity | Test Case |
|--------|-------|----------|-----------|
| BUG-001 | Login accepts wrong/missing credentials | **Critical** | TC-USER-005, TC-USER-006 |
| BUG-008 | POST /pet succeeds without authentication | **Critical** | TC-SEC-001 |
| BUG-002 | PUT /pet accepts missing required `name` | High | TC-PET-006 |
| BUG-004 | findByStatus returns 200 for invalid enum | High | TC-PET-011 |
| BUG-005 | Order accepts negative quantity | High | TC-STORE-003 |
| BUG-007 | GET /user returns password in plaintext | High | TC-SEC-005 |
| BUG-009 | XSS payload stored and returned unescaped | High | TC-SEC-004 |
| BUG-013 | Malformed JSON body causes 500 server crash | High | TC-ERR-002 |
| BUG-003 | POST /pet accepts missing required `photoUrls` | Medium | TC-PET-007 |
| BUG-006 | GET /store/order allows orderId outside spec range | Medium | TC-STORE-006 |
| BUG-010 | Empty body returns 500/405 instead of 400 | Medium | TC-ERR-003 |
| BUG-011 | String path param returns 404 + Java stack trace | Medium | TC-PET-004, TC-ERR-004 |
| BUG-012 | GET /pet/findByStatus averages 1557ms (no pagination) | Medium | TC-PET-008 |

Full details with reproduction steps → [Petstore_API_Bug_Report.md](Petstore_API_Bug_Report.md)

---

## API Modules Tested

| Module | Endpoints |
|--------|-----------|
| **Pet** | `POST /pet` · `GET /pet/{petId}` · `PUT /pet` · `DELETE /pet/{petId}` · `GET /pet/findByStatus` |
| **Store** | `GET /store/inventory` · `POST /store/order` · `GET /store/order/{orderId}` · `DELETE /store/order/{orderId}` |
| **User** | `POST /user` · `GET /user/{username}` · `PUT /user/{username}` · `DELETE /user/{username}` · `GET /user/login` · `GET /user/logout` |

---

## Test Design Approach

Based on the API Testing Concepts from the course PPT:

| Category | What was tested |
|----------|----------------|
| **Functional** | Correct status codes, response schema, full CRUD lifecycle |
| **Data Validation** | Missing required fields, wrong types, boundary values, invalid enum values |
| **Security** | Auth bypass (no api_key), XSS in body, SQL injection in path params, plaintext secrets in response |
| **Error Handling** | Malformed JSON, wrong Content-Type, empty body, non-numeric path params, integer overflow |
| **Performance** | Response time per endpoint (SLA: < 2000ms for single resource, < 3000ms for collections) |

**Authentication:** API Key via `api_key: special-key` header.  
**Variable management:** `petId`, `orderId`, `username` generated dynamically per run in pre-request scripts — no manual setup needed.
