const axios = require('axios');

const BASE_URL = 'https://petstore.swagger.io/v2';

// Never throw on non-2xx so tests can assert on any status code
const client = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true,
  timeout: 10000,
});

const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  'api_key': 'special-key',
};

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

module.exports = { client, AUTH_HEADERS, JSON_HEADERS };
