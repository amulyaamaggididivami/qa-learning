const { client, AUTH_HEADERS, JSON_HEADERS } = require('./helpers/client');

// Unique ID per test run to avoid collisions on the shared demo server
const PET_ID = Math.floor(Math.random() * 80000) + 10000;

const SAMPLE_PET = {
  id: PET_ID,
  name: 'BuddyTest',
  status: 'available',
  photoUrls: ['http://example.com/photo.jpg'],
  category: { id: 1, name: 'Dogs' },
  tags: [{ id: 1, name: 'friendly' }],
};

afterAll(async () => {
  await client.delete(`/pet/${PET_ID}`, { headers: AUTH_HEADERS });
});

// ─── Create ──────────────────────────────────────────────────────────────────

describe('TC-PET-001: POST /pet — Add new pet (happy path)', () => {
  test('returns 200 with correct id, name, and status', async () => {
    const res = await client.post('/pet', SAMPLE_PET, { headers: AUTH_HEADERS });
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(PET_ID);
    expect(res.data.name).toBe('BuddyTest');
    expect(res.data.status).toBe('available');
    expect(res.data.photoUrls).toEqual(expect.arrayContaining(['http://example.com/photo.jpg']));
  });
});

// ─── Read ─────────────────────────────────────────────────────────────────────

describe('TC-PET-002: GET /pet/{petId} — Valid ID', () => {
  test('returns 200 with full pet object', async () => {
    const res = await client.get(`/pet/${PET_ID}`);
    expect(res.status).toBe(200);
    expect(res.data.id).toBe(PET_ID);
    expect(res.data.name).toBeDefined();
    expect(res.data.status).toBeDefined();
  });
});

describe('TC-PET-003: GET /pet/{petId} — Non-existent ID', () => {
  test('returns 404 with error message', async () => {
    const res = await client.get('/pet/9999999999');
    expect(res.status).toBe(404);
    expect(res.data.message).toMatch(/not found/i);
  });
});

describe('TC-PET-004: GET /pet/{petId} — Invalid string ID', () => {
  // BUG-011: Server returns 404 with Java stack trace instead of 400.
  // Expected: 400 Bad Request with a generic validation message.
  test.skip('should return 400 for non-numeric petId (BUG-011: returns 404 + stack trace)', () => {
    // Skipped: known bug — fix before re-enabling
  });

  // BUG-011 (info disclosure): java.lang.NumberFormatException class name is exposed in error message.
  test.skip('should not expose Java exception class names in error message (BUG-011)', () => {
    // Skipped: confirmed — message contains "java.lang.NumberFormatException: For input string: \"abc\""
  });
});

// ─── Update ───────────────────────────────────────────────────────────────────

describe('TC-PET-005: PUT /pet — Update status and name', () => {
  test('returns 200 with updated fields reflected', async () => {
    const updated = { ...SAMPLE_PET, name: 'BuddyUpdated', status: 'sold' };
    const res = await client.put('/pet', updated, { headers: AUTH_HEADERS });
    expect(res.status).toBe(200);
    expect(res.data.name).toBe('BuddyUpdated');
    expect(res.data.status).toBe('sold');
  });
});

describe('TC-PET-006: PUT /pet — Missing required name field', () => {
  // BUG-002: Server accepts PUT with no name and returns 200.
  // Expected: 400 Bad Request — name is required per Swagger spec.
  test.skip('should return 400 when name field is missing (BUG-002)', () => {
    // Skipped: known bug
  });
});

describe('TC-PET-007: POST /pet — Missing required photoUrls field', () => {
  // BUG-003: Server silently defaults photoUrls to [] and returns 200.
  // Expected: 400 Bad Request — photoUrls is required per Swagger spec.
  test.skip('should return 400 when photoUrls is missing (BUG-003)', () => {
    // Skipped: known bug
  });
});

// ─── Find by Status ───────────────────────────────────────────────────────────

describe('TC-PET-008/009/010: GET /pet/findByStatus — Valid status values', () => {
  test.each([['available'], ['pending'], ['sold']])(
    'status=%s returns 200 and an array',
    async (status) => {
      const res = await client.get(`/pet/findByStatus?status=${status}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    }
  );
});

describe('TC-PET-011: GET /pet/findByStatus — Invalid enum value', () => {
  // BUG-004: Server returns 200 with empty array for unknown status values.
  // Expected: 400 Bad Request — spec only allows available/pending/sold.
  test.skip('should return 400 for status=invalid (BUG-004)', () => {
    // Skipped: known bug
  });
});

// ─── Delete ───────────────────────────────────────────────────────────────────

describe('TC-PET-012: DELETE /pet/{petId} — Valid delete', () => {
  test('returns 200', async () => {
    const tempId = PET_ID + 1;
    await client.post('/pet', { ...SAMPLE_PET, id: tempId }, { headers: AUTH_HEADERS });
    const res = await client.delete(`/pet/${tempId}`, { headers: AUTH_HEADERS });
    expect(res.status).toBe(200);
  });
});

describe('TC-PET-013/014: DELETE then GET — Verify removal', () => {
  test('GET on deleted pet returns 404', async () => {
    const tempId = PET_ID + 2;
    await client.post('/pet', { ...SAMPLE_PET, id: tempId }, { headers: AUTH_HEADERS });
    await client.delete(`/pet/${tempId}`, { headers: AUTH_HEADERS });

    const res = await client.get(`/pet/${tempId}`);
    expect(res.status).toBe(404);
  });

  test('second DELETE on same pet returns 404', async () => {
    const tempId = PET_ID + 3;
    await client.post('/pet', { ...SAMPLE_PET, id: tempId }, { headers: AUTH_HEADERS });
    await client.delete(`/pet/${tempId}`, { headers: AUTH_HEADERS });

    const res = await client.delete(`/pet/${tempId}`, { headers: AUTH_HEADERS });
    expect(res.status).toBe(404);
  });
});
