# Petstore API Test Plan

**API Under Test:** Swagger Petstore  
**Base URL:** `https://petstore.swagger.io/v2`  
**Swagger UI:** https://petstore.swagger.io/#/  
**Date:** 2026-05-22  
**Tester:** Amulya  

---

## 1. Objective

Validate all endpoints of the Petstore REST API for correctness, data validation, authentication behavior, error handling, and performance — covering concepts from the API Testing module (HTTP methods, status codes, authentication, bug categories, Swagger reading).

---

## 2. Scope

| Module | Endpoints | In Scope |
|--------|-----------|----------|
| Pet    | `/pet`, `/pet/{petId}`, `/pet/findByStatus`, `/pet/findByTags`, `/pet/{petId}/uploadImage` | Yes |
| Store  | `/store/inventory`, `/store/order`, `/store/order/{orderId}` | Yes |
| User   | `/user`, `/user/{username}`, `/user/login`, `/user/logout` | Yes |

**Out of scope:** File upload (`/pet/{petId}/uploadImage`), `createWithArray`, `createWithList`

---

## 3. Test Approach

Based on the testing pyramid and shift-left principles from the course:

- **Functional Testing** — verify correct data and status codes per HTTP method contracts
- **Data Validation Testing** — missing fields, wrong types, boundary values, invalid enums
- **Security Testing** — auth bypass, XSS stored in fields, injection in path params
- **Error Handling Testing** — malformed JSON, wrong Content-Type, empty body
- **Performance Testing** — response time per endpoint (SLA: < 1000ms)

### Authentication

The Petstore uses **API Key** authentication via the `api_key` header.  
Valid key: `special-key`  
Tests include both authenticated and unauthenticated requests to protected endpoints.

---

## 4. Test Modules & Coverage

### 4.1 Pet Module (14 test cases)
| Category | Test Cases |
|----------|-----------|
| Happy Path | Create, Read, Update, Delete pet, Find by valid status |
| Negative | Non-existent ID, invalid string ID, invalid status value, missing required fields |
| Security | POST without API key, XSS payload in name field |

### 4.2 Store Module (8 test cases)
| Category | Test Cases |
|----------|-----------|
| Happy Path | Get inventory, create order, get order, delete order |
| Negative | Non-existent order, string ID, already-deleted order |
| Validation | Negative quantity in order |

### 4.3 User Module (11 test cases)
| Category | Test Cases |
|----------|-----------|
| Happy Path | Create, get, update, delete user |
| Auth | Login with valid credentials, logout |
| Negative | Login with wrong password, missing params, non-existent user, get after delete |

### 4.4 Security (5 test cases)
| Category | Test Cases |
|----------|-----------|
| Auth Bypass | DELETE without API key, DELETE with wrong API key, POST without API key |
| Injection | SQL injection in path param |
| XSS | Script tag in name field |

### 4.5 Error Handling (5 test cases)
| Category | Test Cases |
|----------|-----------|
| Content-Type | Wrong Content-Type on POST |
| Body Parsing | Malformed JSON, empty body |
| Path Params | String ID for numeric param, overflow integer ID |

### 4.6 Performance (4 test cases)
| Category | Test Cases |
|----------|-----------|
| Response Time | GET /store/inventory, GET /pet/findByStatus, POST /pet |
| Load | 5 sequential requests to same endpoint |

---

## 5. Entry / Exit Criteria

**Entry:** API is live and Swagger docs are accessible  
**Exit:** All test cases executed, results documented, bugs logged

---

## 6. Tools Used

| Tool | Purpose |
|------|---------|
| curl | Execute HTTP requests and capture status codes |
| Swagger UI | Explore endpoints and understand schema |
| pdftotext | Extract PDF test concepts |

---

## 7. Bug Severity Classification

| Severity | Criteria |
|----------|---------|
| Critical | Auth bypass, data exposure, app crash |
| High | Wrong status code, required field not validated, incorrect business logic |
| Medium | Missing validation, unexpected response format |
| Low | Minor response inconsistency, documentation mismatch |
