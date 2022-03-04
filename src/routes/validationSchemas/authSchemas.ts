import { Schema } from 'express-validator';

export const registerSchema: Schema = {
  email: {
    isEmail: {
      errorMessage: 'Email must be a valid email',
    },
  },
  password: {
    isLength: {
      errorMessage: 'Password should be at least 7 chars long',
      options: { min: 7, max: 32 },
    },
  },
};

export const loginSchema: Schema = {
  email: {
    exists: {
      errorMessage: 'Email is a required field',
    },
  },
  password: {
    exists: {
      errorMessage: 'Password is a required field',
    },
  },
};
