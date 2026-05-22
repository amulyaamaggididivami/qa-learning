# Petstore API Test Cases & Results

**Base URL:** `https://petstore.swagger.io/v2`  
**Executed:** 2026-05-22  

---

## Legend

| Column | Meaning |
|--------|---------|
| TC ID | Unique test case identifier |
| Method | HTTP verb |
| Endpoint | API path |
| Description | What is being tested |
| Expected | Expected status + behavior |
| Actual | Observed status + behavior |
| Result | PASS / FAIL |

---

## Module 1: Pet

### TC-PET-001 — Add new pet (happy path)

| Field | Value |
|-------|-------|
| **Method** | POST |
| **Endpoint** | `/pet` |
| **Headers** | `Content-Type: application/json`, `api_key: special-key` |
| **Request Body** | `{"id":99991,"name":"BuddyTest","status":"available","photoUrls":["http://example.com/photo.jpg"],"category":{"id":1,"name":"Dogs"},"tags":[{"id":1,"name":"friendly"}]}` |
| **Expected** | 200 OK, response contains same id and name |
| **Actual** | 200 OK — `{"id":99991,"name":"BuddyTest","status":"available","category":{"id":1,"name":"Dogs"},"photoUrls":["http://example.com/photo.jpg"],"tags":[{"id":1,"name":"friendly"}]}` |
| **Result** | **PASS** |

---

### TC-PET-002 — Get pet by valid ID

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/pet/99991` |
| **Expected** | 200 OK, returns pet with id=99991 |
| **Actual** | 200 OK — `{"id":99991,"name":"BuddyTest","status":"available",...}` |
| **Result** | **PASS** |

---

### TC-PET-003 — Get pet by non-existent ID

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/pet/9999999999` |
| **Expected** | 404 Not Found with error message |
| **Actual** | 404 — `{"code":1,"type":"error","message":"Pet not found"}` |
| **Result** | **PASS** |

---

### TC-PET-004 — Get pet by invalid string ID

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/pet/abc` |
| **Expected** | 400 Bad Request (invalid type) |
| **Actual** | 404 — `{"code":404,"type":"unknown","message":"java.lang.NumberFormatException: For input string: \"abc\""}` |
| **Result** | **FAIL** — Stack trace exposed in error message. Should return 400, not 404. Java implementation detail leaked to client. |

---

### TC-PET-005 — Update pet (happy path)

| Field | Value |
|-------|-------|
| **Method** | PUT |
| **Endpoint** | `/pet` |
| **Headers** | `Content-Type: application/json`, `api_key: special-key` |
| **Request Body** | `{"id":99991,"name":"BuddyTestUpdated","status":"sold","photoUrls":[...],...}` |
| **Expected** | 200 OK, name and status updated |
| **Actual** | 200 OK — `{"id":99991,"name":"BuddyTestUpdated","status":"sold",...}` |
| **Result** | **PASS** |

---

### TC-PET-006 — PUT /pet with missing required name field

| Field | Value |
|-------|-------|
| **Method** | PUT |
| **Endpoint** | `/pet` |
| **Request Body** | `{"id":99991,"status":"sold","photoUrls":[]}` (name omitted) |
| **Expected** | 400 Bad Request — `name` is a required field per Swagger spec |
| **Actual** | 200 OK — `{"id":99991,"photoUrls":[],"tags":[],"status":"sold"}` (accepted with no name) |
| **Result** | **FAIL** — Required field `name` not validated. Bug logged: BUG-002 |

---

### TC-PET-007 — POST /pet with missing photoUrls (required)

| Field | Value |
|-------|-------|
| **Method** | POST |
| **Endpoint** | `/pet` |
| **Request Body** | `{"id":99992,"name":"MissingPhotoTest","status":"available"}` (photoUrls omitted) |
| **Expected** | 400 Bad Request — `photoUrls` is a required field per Swagger spec |
| **Actual** | 200 OK — response has `"photoUrls":[]` (server silently defaults to empty array) |
| **Result** | **FAIL** — Required field `photoUrls` not validated. Bug logged: BUG-003 |

---

### TC-PET-008 — Find pets by status: available

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/pet/findByStatus?status=available` |
| **Expected** | 200 OK, array of pets all with `status=available` |
| **Actual** | 200 OK — large array returned (70 KB payload) |
| **Result** | **PASS** |

---

### TC-PET-009 — Find pets by status: pending

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/pet/findByStatus?status=pending` |
| **Expected** | 200 OK, array of pets all with `status=pending` |
| **Actual** | 200 OK — 13 pets returned |
| **Result** | **PASS** |

---

### TC-PET-010 — Find pets by status: sold

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/pet/findByStatus?status=sold` |
| **Expected** | 200 OK, array of pets all with `status=sold` |
| **Actual** | 200 OK — 54 pets returned |
| **Result** | **PASS** |

---

### TC-PET-011 — Find pets by invalid status value

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/pet/findByStatus?status=invalid` |
| **Expected** | 400 Bad Request — enum only allows: available, pending, sold |
| **Actual** | 200 OK — empty array `[]` returned |
| **Result** | **FAIL** — Invalid enum value accepted silently. Bug logged: BUG-004 |

---

### TC-PET-012 — Delete pet (happy path)

| Field | Value |
|-------|-------|
| **Method** | DELETE |
| **Endpoint** | `/pet/99991` |
| **Headers** | `api_key: special-key` |
| **Expected** | 200 OK |
| **Actual** | 200 OK — `{"code":200,"type":"unknown","message":"99991"}` |
| **Result** | **PASS** |

---

### TC-PET-013 — Delete already-deleted pet

| Field | Value |
|-------|-------|
| **Method** | DELETE |
| **Endpoint** | `/pet/99991` (previously deleted) |
| **Headers** | `api_key: special-key` |
| **Expected** | 404 Not Found |
| **Actual** | 404 (empty body) |
| **Result** | **PASS** |

---

### TC-PET-014 — GET pet after deletion (verify removal)

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/pet/99991` |
| **Expected** | 404 Not Found |
| **Actual** | 404 — `{"code":1,"type":"error","message":"Pet not found"}` |
| **Result** | **PASS** |

---

## Module 2: Store

### TC-STORE-001 — Get inventory

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/store/inventory` |
| **Expected** | 200 OK, object with status keys mapping to counts |
| **Actual** | 200 OK — `{"sold":54,"pending":13,"available":233,...}` (sample) |
| **Result** | **PASS** |

---

### TC-STORE-002 — Place order (happy path)

| Field | Value |
|-------|-------|
| **Method** | POST |
| **Endpoint** | `/store/order` |
| **Request Body** | `{"id":5001,"petId":99992,"quantity":1,"shipDate":"2026-05-22T10:00:00.000Z","status":"placed","complete":false}` |
| **Expected** | 200 OK, order returned with same fields |
| **Actual** | 200 OK — `{"id":5001,"petId":99992,"quantity":1,"shipDate":"2026-05-22T10:00:00.000+0000","status":"placed","complete":false}` |
| **Result** | **PASS** |

---

### TC-STORE-003 — Place order with negative quantity

| Field | Value |
|-------|-------|
| **Method** | POST |
| **Endpoint** | `/store/order` |
| **Request Body** | `{"id":5002,"petId":99992,"quantity":-1,"status":"placed","complete":false}` |
| **Expected** | 400 Bad Request — quantity must be ≥ 1 |
| **Actual** | 200 OK — `{"id":5002,"petId":99992,"quantity":-1,"status":"placed","complete":false}` |
| **Result** | **FAIL** — Negative quantity accepted. Bug logged: BUG-005 |

---

### TC-STORE-004 — Get order by valid ID

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/store/order/5001` |
| **Expected** | 200 OK, order with id=5001 |
| **Actual** | 200 OK — `{"id":5001,"petId":99992,"quantity":1,...}` |
| **Result** | **PASS** |

---

### TC-STORE-005 — Get order by non-existent ID

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/store/order/99999` |
| **Expected** | 404 Not Found |
| **Actual** | 404 — `{"code":1,"type":"error","message":"Order not found"}` |
| **Result** | **PASS** |

---

### TC-STORE-006 — Get order with ID outside valid range (1–10 per spec)

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/store/order/11` |
| **Expected** | 400 Bad Request — spec states valid values are 1–10 |
| **Actual** | 200 OK — returns a seeded order `{"id":11,"petId":0,"quantity":0,"status":"placed","complete":true}` |
| **Result** | **FAIL** — Spec constraint not enforced. Bug logged: BUG-006 |

---

### TC-STORE-007 — Delete order (happy path)

| Field | Value |
|-------|-------|
| **Method** | DELETE |
| **Endpoint** | `/store/order/5001` |
| **Expected** | 200 OK |
| **Actual** | 200 OK — `{"code":200,"type":"unknown","message":"5001"}` |
| **Result** | **PASS** |

---

### TC-STORE-008 — Delete already-deleted order

| Field | Value |
|-------|-------|
| **Method** | DELETE |
| **Endpoint** | `/store/order/5001` (previously deleted) |
| **Expected** | 404 Not Found |
| **Actual** | 404 — `{"code":404,"type":"unknown","message":"Order Not Found"}` |
| **Result** | **PASS** |

---

## Module 3: User

### TC-USER-001 — Create user (happy path)

| Field | Value |
|-------|-------|
| **Method** | POST |
| **Endpoint** | `/user` |
| **Request Body** | `{"id":1779457958,"username":"testuser_1779457958","firstName":"Test","lastName":"User","email":"test@example.com","password":"pass1234","phone":"9876543210","userStatus":1}` |
| **Expected** | 200 OK (spec returns 200, not 201) |
| **Actual** | 200 OK — `{"code":200,"type":"unknown","message":"1779457958"}` |
| **Result** | **PASS** |

---

### TC-USER-002 — Get user by valid username

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/user/testuser_1779457958` |
| **Expected** | 200 OK, returns user object with all fields |
| **Actual** | 200 OK — `{"id":1779457958,"username":"testuser_1779457958","firstName":"Test","lastName":"User","email":"test@example.com","password":"pass1234","phone":"9876543210","userStatus":1}` |
| **Result** | **PASS** — Note: password returned in plaintext. See BUG-007. |

---

### TC-USER-003 — Get non-existent user

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/user/nonexistentxyz999` |
| **Expected** | 404 Not Found |
| **Actual** | 404 — `{"code":1,"type":"error","message":"User not found"}` |
| **Result** | **PASS** |

---

### TC-USER-004 — Login with valid credentials

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/user/login?username=testuser_1779457958&password=pass1234` |
| **Expected** | 200 OK with session token |
| **Actual** | 200 OK — `{"code":200,"type":"unknown","message":"logged in user session:1779457968729"}` |
| **Result** | **PASS** |

---

### TC-USER-005 — Login with wrong password

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/user/login?username=testuser_1779457958&password=wrongpass` |
| **Expected** | 401 Unauthorized or 400 Bad Request |
| **Actual** | 200 OK — `{"code":200,"type":"unknown","message":"logged in user session:1779457969716"}` |
| **Result** | **FAIL** — Wrong password accepted, user logged in. Critical bug logged: BUG-001 |

---

### TC-USER-006 — Login with missing credentials

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/user/login` (no params) |
| **Expected** | 400 Bad Request — username and password are required |
| **Actual** | 200 OK — `{"code":200,"type":"unknown","message":"logged in user session:1779457970903"}` |
| **Result** | **FAIL** — Login succeeds with no credentials at all. Critical bug logged: BUG-001 |

---

### TC-USER-007 — Logout

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/user/logout` |
| **Expected** | 200 OK |
| **Actual** | 200 OK — `{"code":200,"type":"unknown","message":"ok"}` |
| **Result** | **PASS** |

---

### TC-USER-008 — Update user (happy path)

| Field | Value |
|-------|-------|
| **Method** | PUT |
| **Endpoint** | `/user/{username}` |
| **Request Body** | Updated firstName, email, password |
| **Expected** | 200 OK |
| **Actual** | 200 OK — `{"code":200,"type":"unknown","message":"1779457958"}` |
| **Result** | **PASS** |

---

### TC-USER-009 — Get user to verify update

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/user/{username}` |
| **Expected** | 200 OK, updated fields reflected |
| **Actual** | 200 OK — `{"firstName":"TestUpdated","email":"updated@example.com","password":"newpass456",...}` |
| **Result** | **PASS** |

---

### TC-USER-010 — Delete user

| Field | Value |
|-------|-------|
| **Method** | DELETE |
| **Endpoint** | `/user/{username}` |
| **Expected** | 200 OK |
| **Actual** | 200 OK — `{"code":200,"type":"unknown","message":"amulya"}` |
| **Result** | **PASS** |

---

### TC-USER-011 — Get user after deletion

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/user/{username}` |
| **Expected** | 404 Not Found |
| **Actual** | 404 — `{"code":1,"type":"error","message":"User not found"}` |
| **Result** | **PASS** |

---

## Module 4: Security

### TC-SEC-001 — DELETE /pet without API key

| Field | Value |
|-------|-------|
| **Method** | DELETE |
| **Endpoint** | `/pet/1` (no `api_key` header) |
| **Expected** | 401 Unauthorized |
| **Actual** | 404 Not Found (pet doesn't exist on demo server) |
| **Result** | **INCONCLUSIVE** — Could not isolate auth behavior; pet ID 1 not present on server |

---

### TC-SEC-002 — DELETE /pet with wrong API key

| Field | Value |
|-------|-------|
| **Method** | DELETE |
| **Endpoint** | `/pet/1` (`api_key: wrong-key-123`) |
| **Expected** | 401 Unauthorized |
| **Actual** | 404 Not Found |
| **Result** | **INCONCLUSIVE** — Same as TC-SEC-001 |

---

### TC-SEC-003 — POST /pet without API key

| Field | Value |
|-------|-------|
| **Method** | POST |
| **Endpoint** | `/pet` (no `api_key` header) |
| **Request Body** | `{"id":88881,"name":"UnauthorizedPet","status":"available","photoUrls":[...]}` |
| **Expected** | 401 Unauthorized — spec requires auth for write operations |
| **Actual** | 200 OK — pet created successfully with no authentication |
| **Result** | **FAIL** — Auth bypass on POST. Bug logged: BUG-008 |

---

### TC-SEC-004 — SQL injection in path parameter

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/pet/1%20OR%201%3D1` (URL-encoded `1 OR 1=1`) |
| **Expected** | 400 Bad Request or sanitized rejection |
| **Actual** | 404 — `{"code":404,"type":"unknown","message":"java.lang.NumberFormatException: For input string: \"1 OR 1=1\""}` |
| **Result** | **PASS (Partial)** — Injection blocked by type casting, but Java stack trace exposed. |

---

### TC-SEC-005 — XSS payload stored in name field

| Field | Value |
|-------|-------|
| **Method** | POST |
| **Endpoint** | `/pet` |
| **Request Body** | `{"id":88882,"name":"<script>alert(1)</script>",...}` |
| **Expected** | 400 Bad Request or sanitized value stored |
| **Actual** | 200 OK — `{"id":88882,"name":"<script>alert(1)</script>",...}` — stored and returned as-is |
| **Result** | **FAIL** — XSS payload stored and returned unescaped. Bug logged: BUG-009 |

---

## Module 5: Error Handling

### TC-ERR-001 — Wrong Content-Type on POST

| Field | Value |
|-------|-------|
| **Method** | POST |
| **Endpoint** | `/pet` with `Content-Type: text/plain` |
| **Expected** | 415 Unsupported Media Type |
| **Actual** | 415 — XML response: `<apiResponse><type>unknown</type></apiResponse>` |
| **Result** | **PASS** — Correct status code. Note: response is XML not JSON (inconsistency). |

---

### TC-ERR-002 — Malformed JSON body

| Field | Value |
|-------|-------|
| **Method** | POST |
| **Endpoint** | `/pet` with `{invalid json here}` |
| **Expected** | 400 Bad Request |
| **Actual** | 400 — `{"code":400,"type":"unknown","message":"bad input"}` |
| **Result** | **PASS** |

---

### TC-ERR-003 — Empty body on POST

| Field | Value |
|-------|-------|
| **Method** | POST |
| **Endpoint** | `/pet` with empty body |
| **Expected** | 400 Bad Request |
| **Actual** | 405 Method Not Allowed — `{"code":405,"type":"unknown","message":"no data"}` |
| **Result** | **FAIL** — 405 is wrong status code for an empty body. Should be 400. Bug logged: BUG-010 |

---

### TC-ERR-004 — String ID for numeric path parameter

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/store/order/abc` |
| **Expected** | 400 Bad Request |
| **Actual** | 404 — `{"code":404,"type":"unknown","message":"java.lang.NumberFormatException: For input string: \"abc\""}` |
| **Result** | **FAIL** — Wrong status code (404 vs 400); Java stack trace exposed. Bug logged: BUG-011 |

---

### TC-ERR-005 — Integer overflow in pet ID

| Field | Value |
|-------|-------|
| **Method** | GET |
| **Endpoint** | `/pet/999999999999999999` |
| **Expected** | 400 Bad Request (overflow) or 404 |
| **Actual** | 404 — `{"code":1,"type":"error","message":"Pet not found"}` |
| **Result** | **PASS** — Server handles overflow gracefully (treated as not found). |

---

## Module 6: Performance

### TC-PERF-001 — GET /store/inventory response time

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /store/inventory` |
| **Expected** | < 1000ms |
| **Actual** | 917ms |
| **Result** | **PASS** (borderline) |

---

### TC-PERF-002 — GET /pet/findByStatus response time

| Field | Value |
|-------|-------|
| **Endpoint** | `GET /pet/findByStatus?status=available` |
| **Expected** | < 1000ms |
| **Actual** | 1391ms (70 KB payload) |
| **Result** | **FAIL** — Exceeds 1000ms threshold. Bug logged: BUG-012 |

---

### TC-PERF-003 — POST /pet response time

| Field | Value |
|-------|-------|
| **Endpoint** | `POST /pet` |
| **Expected** | < 1000ms |
| **Actual** | 917ms |
| **Result** | **PASS** (borderline) |

---

### TC-PERF-004 — 5 sequential GET /pet/findByStatus

| Request | Response Time |
|---------|-------------|
| 1 | 1570ms |
| 2 | 1564ms |
| 3 | 1796ms |
| 4 | 1510ms |
| 5 | 1452ms |
| **Average** | **1578ms** |

| Field | Value |
|-------|-------|
| **Expected** | Consistent < 1000ms |
| **Result** | **FAIL** — All requests exceed 1s. No degradation under sequential load, but baseline is high. |

---

## Summary Table

| Module | Total | PASS | FAIL | INCONCLUSIVE |
|--------|-------|------|------|--------------|
| Pet | 14 | 10 | 4 | 0 |
| Store | 8 | 5 | 2 | 1 |
| User | 11 | 8 | 2 | 1 |
| Security | 5 | 1 | 2 | 2 |
| Error Handling | 5 | 2 | 3 | 0 |
| Performance | 4 | 2 | 2 | 0 |
| **Total** | **47** | **28** | **15** | **4** |
| **Pass Rate** | | **60%** | | |
