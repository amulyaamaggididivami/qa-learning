const { client, AUTH_HEADERS } = require('./helpers/client');

const ORDER_ID = Math.floor(Math.random() * 80000) + 10000;
const PET_ID_FOR_ORDER = Math.floor(Math.random() * 80000) + 10000;

const SAMPLE_ORDER = {
  id: ORDER_ID,
  petId: PET_ID_FOR_ORDER,
  quantity: 2,
  shipDate: '2026-05-22T10:00:00.000Z',
  status: 'placed',
  complete: false,
};

afterAll(async () => {
  await client.delete(`/store/order/${ORDER_ID}`, { headers: AUTH_HEADERS });
});

// ─── Inventory ────────────────────────────────────────────────────────────────

describe('TC-STORE-001: GET /store/inventory', () => {
  test('returns 200 with an object of status counts', async () => {
    const res = await client.get('/store/inventory');
    expect(res.status).toBe(200);
    expect(typeof res.data).toBe('object');
    expect(Array.isArray(res.data)).toBe(false);
  });
});

// ─── Create Order ─────────────────────────────────────────────────────────────

describe('TC-STORE-002: POST /store/order — Valid order', () => {
  test('returns 200 with correct id, petId, quantity, and status', async () => {
    const res = await client.post('/store/order', SAMPLE_ORDER, { headers: AUTH_HEADERS });
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(ORDER_ID);
    expect(res.data.petId).toBe(PET_ID_FOR_ORDER);
    expect(res.data.quantity).toBe(2);
    expect(res.data.status).toBe('placed');
    expect(res.data.complete).toBe(false);
  });
});

describe('TC-STORE-003: POST /store/order — Negative quantity', () => {
  // BUG-005: Server accepts negative quantity and returns 200.
  // Expected: 400 Bad Request — quantity must be >= 1.
  test.skip('should return 400 for quantity=-1 (BUG-005)', () => {
    // Skipped: known bug
  });
});

// ─── Read Order ───────────────────────────────────────────────────────────────

describe('TC-STORE-004: GET /store/order/{orderId} — Valid ID', () => {
  test('returns 200 with full order object', async () => {
    const res = await client.get(`/store/order/${ORDER_ID}`);
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(ORDER_ID);
    expect(res.data.status).toBe('placed');
    expect(res.data.shipDate).toBeDefined();
  });
});

describe('TC-STORE-005: GET /store/order/{orderId} — Non-existent order', () => {
  test('returns 404 with error message', async () => {
    const res = await client.get('/store/order/99999999');
    expect(res.status).toBe(404);
    expect(res.data.message).toMatch(/not found/i);
  });
});

describe('TC-STORE-006: GET /store/order/{orderId} — ID outside spec range (1–10)', () => {
  // BUG-006: Server returns 200 with seeded data for orderId=11 instead of 400.
  // Swagger spec states valid values: 1–10.
  test.skip('should return 400 for orderId > 10 (BUG-006)', () => {
    // Skipped: known bug
  });
});

// ─── Delete Order ─────────────────────────────────────────────────────────────

describe('TC-STORE-007: DELETE /store/order/{orderId} — Valid delete', () => {
  test('returns 200', async () => {
    const tempOrderId = ORDER_ID + 1;
    await client.post('/store/order', { ...SAMPLE_ORDER, id: tempOrderId }, { headers: AUTH_HEADERS });
    const res = await client.delete(`/store/order/${tempOrderId}`);
    expect(res.status).toBe(200);
  });
});

describe('TC-STORE-008: DELETE /store/order/{orderId} — Already deleted', () => {
  test('returns 404 on second delete attempt', async () => {
    const tempOrderId = ORDER_ID + 2;
    await client.post('/store/order', { ...SAMPLE_ORDER, id: tempOrderId }, { headers: AUTH_HEADERS });
    await client.delete(`/store/order/${tempOrderId}`);

    const res = await client.delete(`/store/order/${tempOrderId}`);
    expect(res.status).toBe(404);
  });
});
