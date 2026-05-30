export const CREDENTIALS = {
  valid: {
    email: 'pub@prestashop.com',
    password: '123456789',
  },
  invalid: {
    email: 'notauser@invalid.com',
    password: 'wrongpassword',
  },
};

export const NEW_USER = {
  firstName: 'Test',
  lastName: 'Automation',
  email: `testuser${Date.now()}@mailinator.com`,
  password: 'Test@12345678',
};

export const SEARCH = {
  valid: 'T-shirt',
  partial: 'shirt',
  noResults: 'xyzqwertynotexist',
};

export const PRODUCT = {
  categoryUrl: '/3-clothes',
};

export const ADDRESS = {
  firstName: 'John',
  lastName: 'Doe',
  address1: '123 Automation Street',
  postCode: '75001',
  city: 'Paris',
  phone: '0123456789',
};

export const PAGES = {
  home: '/',
  login: '/login',
  register: '/registration',
  cart: '/cart',
  account: '/my-account',
  contact: '/contact-us',
};
