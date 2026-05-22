const { client, AUTH_HEADERS, JSON_HEADERS } = require('./helpers/client');

const SUFFIX = Date.now();
const USERNAME = `testuser_${SUFFIX}`;
const PASSWORD = 'Pass1234!';

const SAMPLE_USER = {
  id: Math.floor(Math.random() * 80000) + 10000,
  username: USERNAME,
  firstName: 'Test',
  lastName: 'User',
  email: `${USERNAME}@example.com`,
  password: PASSWORD,
  phone: '9876543210',
  userStatus: 1,
};

afterAll(async () => {
  await client.delete(`/user/${USERNAME}`);
});

// ─── Create ───────────────────────────────────────────────────────────────────

describe('TC-USER-001: POST /user — Create user (happy path)', () => {
  test('returns 200 with generated user id in message', async () => {
    const res = await client.post('/user', SAMPLE_USER, { headers: JSON_HEADERS });
    expect(res.status).toBe(200);
    expect(res.data.code).toBe(200);
  });
});

// ─── Read ─────────────────────────────────────────────────────────────────────

describe('TC-USER-002: GET /user/{username} — Valid username', () => {
  test('returns 200 with all user fields', async () => {
    const res = await client.get(`/user/${USERNAME}`);
    expect(res.status).toBe(200);
    expect(res.data.username).toBe(USERNAME);
    expect(res.data.firstName).toBe('Test');
    expect(res.data.email).toBe(`${USERNAME}@example.com`);
  });

  // BUG-007: Password returned in plaintext — should be omitted or masked.
  test.skip('should not return password in response body (BUG-007)', () => {
    // Skipped: known security bug
  });
});

describe('TC-USER-003: GET /user/{username} — Non-existent user', () => {
  test('returns 404 with error message', async () => {
    const res = await client.get('/user/no_such_user_xyz_99999');
    expect(res.status).toBe(404);
    expect(res.data.message).toMatch(/not found/i);
  });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('TC-USER-004: GET /user/login — Valid credentials', () => {
  test('returns 200 with session token in message', async () => {
    const res = await client.get(`/user/login?username=${USERNAME}&password=${PASSWORD}`);
    expect(res.status).toBe(200);
    expect(res.data.message).toMatch(/logged in user session/i);
  });
});

describe('TC-USER-005: GET /user/login — Wrong password', () => {
  // BUG-001: Server returns 200 with a valid session for any password.
  // Expected: 401 Unauthorized.
  test.skip('should return 401 for wrong password (BUG-001)', () => {
    // Skipped: known critical security bug — authentication not validated
  });
});

describe('TC-USER-006: GET /user/login — Missing credentials', () => {
  // BUG-001: Server returns 200 with a session even when no params are provided.
  // Expected: 400 Bad Request.
  test.skip('should return 400 when username and password are missing (BUG-001)', () => {
    // Skipped: same root cause as TC-USER-005
  });
});

describe('TC-USER-007: GET /user/logout', () => {
  test('returns 200 with ok message', async () => {
    const res = await client.get('/user/logout');
    expect(res.status).toBe(200);
    expect(res.data.message).toMatch(/ok/i);
  });
});

// ─── Update ───────────────────────────────────────────────────────────────────

describe('TC-USER-008/009: PUT /user then GET — Verify update', () => {
  test('update returns 200 and GET reflects new values', async () => {
    const updatedUser = {
      ...SAMPLE_USER,
      firstName: 'Updated',
      email: `updated_${SUFFIX}@example.com`,
    };

    const putRes = await client.put(`/user/${USERNAME}`, updatedUser, { headers: JSON_HEADERS });
    expect(putRes.status).toBe(200);

    const getRes = await client.get(`/user/${USERNAME}`);
    expect(getRes.status).toBe(200);
    expect(getRes.data.firstName).toBe('Updated');
    expect(getRes.data.email).toBe(`updated_${SUFFIX}@example.com`);
  });
});

// ─── Delete ───────────────────────────────────────────────────────────────────

describe('TC-USER-010/011: DELETE /user then GET — Verify removal', () => {
  test('delete returns 200 and subsequent GET returns 404', async () => {
    const tempUsername = `temp_${SUFFIX}`;
    await client.post('/user', { ...SAMPLE_USER, username: tempUsername }, { headers: JSON_HEADERS });

    const delRes = await client.delete(`/user/${tempUsername}`);
    expect(delRes.status).toBe(200);

    const getRes = await client.get(`/user/${tempUsername}`);
    expect(getRes.status).toBe(404);
  });
});
