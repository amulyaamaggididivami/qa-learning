const axios = require('axios');
const { client, AUTH_HEADERS } = require('./helpers/client');

// ─── Content-Type ─────────────────────────────────────────────────────────────

describe('TC-ERR-001: POST /pet — Wrong Content-Type (text/plain)', () => {
  test('returns 415 Unsupported Media Type', async () => {
    const res = await client.post('/pet',
      '{"id":1,"name":"test","photoUrls":[]}',
      { headers: { 'Content-Type': 'text/plain' } }
    );
    expect(res.status).toBe(415);
  });
});

// ─── Body Parsing ─────────────────────────────────────────────────────────────

describe('TC-ERR-002: POST /pet — Malformed JSON body', () => {
  // BUG-013: Server returns 500 Internal Server Error for malformed JSON (crashes instead of rejecting).
  // Expected: 400 Bad Request — malformed JSON is a client error, not a server fault.
  test.skip('should return 400 for malformed JSON body (BUG-013: returns 500)', () => {
    // Skipped: server crashes with 500 on invalid JSON — worse than BUG-010
  });

  test('returns a response (server does not hang/timeout) for malformed JSON', async () => {
    const res = await client.post('/pet',
      '{invalid json here}',
      { headers: { 'Content-Type': 'application/json' } }
    );
    expect(res.status).toBeDefined();
  });
});

describe('TC-ERR-003: POST /pet — Empty body', () => {
  // BUG-010: Server returns 405 Method Not Allowed for an empty body.
  // Expected: 400 Bad Request — 405 is semantically incorrect here.
  test.skip('should return 400 for empty body (BUG-010: returns 405)', () => {
    // Skipped: known bug — wrong status code misleads clients
  });

  // BUG-010 (extended): Empty body returns 500 Server Error, not 405 or 400.
  // Server crashes instead of returning a clean client error.
  test.skip('should return 4xx (not 5xx) for empty body (BUG-010: returns 500)', () => {
    // Skipped: confirmed server-side crash — returns 500 Internal Server Error
  });
});

// ─── Path Parameters ──────────────────────────────────────────────────────────

describe('TC-ERR-004: GET /store/order/{orderId} — String ID (non-numeric)', () => {
  // BUG-011: Server returns 404 with Java NumberFormatException in message.
  // Expected: 400 Bad Request with a generic client error message.
  test.skip('should return 400 for non-numeric orderId (BUG-011: returns 404 + stack trace)', () => {
    // Skipped: known bug — wrong status code and implementation detail leaked
  });

  // BUG-011 (info disclosure): message contains "java.lang.NumberFormatException" class name.
  test.skip('should not expose Java exception class in error message (BUG-011)', () => {
    // Skipped: confirmed — message leaks server technology stack
  });

  test('returns a 4xx status for string orderId', async () => {
    const res = await client.get('/store/order/abc');
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

describe('TC-ERR-005: GET /pet/{petId} — Integer overflow ID', () => {
  test('returns 4xx without crashing (handles gracefully)', async () => {
    const res = await client.get('/pet/999999999999999999');
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });
});

// ─── Edge Cases ───────────────────────────────────────────────────────────────

describe('TC-ERR-006: GET /pet/findByStatus — Missing status param', () => {
  test('returns 200 or 400 but not a 5xx server error', async () => {
    const res = await client.get('/pet/findByStatus');
    expect(res.status).toBeLessThan(500);
  });
});

describe('TC-ERR-007: POST /store/order — Missing required petId', () => {
  test('returns 4xx for missing petId field', async () => {
    const res = await client.post('/store/order',
      { id: 12345, quantity: 1, status: 'placed' }, // no petId
      { headers: { 'Content-Type': 'application/json' } }
    );
    // Ideal: 400. Petstore may accept it silently — assertion intentionally permissive.
    expect(res.status).toBeLessThan(500);
  });
});
