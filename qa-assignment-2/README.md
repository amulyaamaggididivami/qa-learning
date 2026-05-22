# QA Assignment 2 — API Testing: Swagger Petstore

**API Under Test:** [Swagger Petstore](https://petstore.swagger.io/#/)  
**Base URL:** `https://petstore.swagger.io/v2`  
**Reference Material:** `02_API_Testing_Concepts.pptx.pdf`  

---

## Folder Structure

```
qa-assignment-2/
├── README.md                        # This file
├── 02_API_Testing_Concepts.pptx.pdf # Course reference material
├── Petstore_API_Test_Plan.md        # Scope, approach, modules, severity matrix
├── Petstore_API_Test_Cases.md       # 47 manual test cases with actual results
├── Petstore_API_Bug_Report.md       # 13 bugs found with repro steps & impact
└── tests/                           # Automated Jest test suite
    ├── package.json
    ├── helpers/
    │   └── client.js                # Shared axios instance
    ├── pet.test.js                  # Pet module (14 tests)
    ├── store.test.js                # Store module (8 tests)
    ├── user.test.js                 # User module (11 tests)
    ├── security.test.js             # Security (5 tests)
    └── errors.test.js               # Error handling (7 tests)
```

---

## Running the Tests

```bash
cd qa-assignment-2/tests
npm install
npm test                   # run all suites
npm run test:pet           # pet module only
npm run test:store         # store module only
npm run test:user          # user module only
npm run test:security      # security tests only
npm run test:errors        # error handling tests only
```

**Requirements:** Node.js 18+, internet access to `petstore.swagger.io`

---

## Test Results Summary

| Module | Total | Pass | Skip (Known Bug) | Fail |
|--------|-------|------|-------------------|------|
| Pet | 14 | 10 | 4 | 0 |
| Store | 8 | 6 | 2 | 0 |
| User | 11 | 8 | 3 | 0 |
| Security | 5 | 3 | 2 | 0 |
| Error Handling | 7 | 5 | 5 | 0 |
| **Total** | **51** | **34** | **17** | **0** |

> Skipped tests are known bugs — each skip comment references the bug ID (e.g. `BUG-001`). Re-enable them once fixed to confirm the fix.

---

## Bugs Found

| Bug ID | Title | Severity |
|--------|-------|----------|
| BUG-001 | Login accepts wrong/missing credentials | **Critical** |
| BUG-008 | POST /pet succeeds without authentication | **Critical** |
| BUG-002 | PUT /pet accepts missing required `name` field | High |
| BUG-004 | findByStatus returns 200 for invalid enum value | High |
| BUG-005 | POST /store/order accepts negative quantity | High |
| BUG-007 | GET /user returns password in plaintext | High |
| BUG-009 | XSS payload stored and returned unescaped | High |
| BUG-013 | Malformed JSON body causes 500 server crash | High |
| BUG-003 | POST /pet accepts missing required `photoUrls` | Medium |
| BUG-006 | GET /store/order allows orderId outside spec range | Medium |
| BUG-010 | Empty body returns 500 instead of 400 | Medium |
| BUG-011 | String path param returns 404 + Java stack trace | Medium |
| BUG-012 | GET /pet/findByStatus averages 1557ms (no pagination) | Medium |

Full details with reproduction steps in [Petstore_API_Bug_Report.md](Petstore_API_Bug_Report.md).

---

## API Modules Tested

### Pet `/pet`
`POST /pet` · `GET /pet/{petId}` · `PUT /pet` · `DELETE /pet/{petId}` · `GET /pet/findByStatus`

### Store `/store`
`GET /store/inventory` · `POST /store/order` · `GET /store/order/{orderId}` · `DELETE /store/order/{orderId}`

### User `/user`
`POST /user` · `GET /user/{username}` · `PUT /user/{username}` · `DELETE /user/{username}` · `GET /user/login` · `GET /user/logout`

---

## Test Design Approach

Based on the API Testing Concepts from the course PPT:

| Category | What was tested |
|----------|----------------|
| **Functional** | Correct status codes, response schema, CRUD lifecycle |
| **Data Validation** | Missing required fields, wrong types, boundary values, invalid enums |
| **Security** | Auth bypass, XSS in body fields, SQL injection in path params |
| **Error Handling** | Malformed JSON, wrong Content-Type, empty body, type mismatch in path params |
| **Performance** | Response time per endpoint (SLA: < 1000ms) |

**Authentication:** API Key via `api_key: special-key` header (Petstore's auth model).

---

## Key Observations

1. **Authentication is not enforced** — write operations (POST/PUT/DELETE) work without any API key (BUG-008), and login returns a session for any credentials including none (BUG-001).
2. **No input validation on required fields** — `name` and `photoUrls` marked required in the Swagger spec are silently ignored server-side.
3. **Server crashes (500) on bad input** — malformed JSON and empty body both cause 500 rather than a clean 400.
4. **Stack traces leaked** — `java.lang.NumberFormatException` class name appears in error responses, exposing server technology.
5. **No pagination on collection endpoints** — `GET /pet/findByStatus` returns the full dataset (~70 KB) with no limit/offset, causing ~1.5s response times.
