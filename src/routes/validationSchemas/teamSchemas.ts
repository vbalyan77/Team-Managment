import { Schema } from 'express-validator';
import ROLES from '../../constants/Roles';

export const createSchema: Schema = {
  title: {
    isString: true,
    exists: {
      errorMessage: 'title is a required field',
    },
  },
};

export const addMemberSchema: Schema = {
  users: {
    exists: {
      errorMessage: 'users is a required field',
    },
  },
};

export const memberIdSchema: Schema = {
  memberId: {
    exists: {
      errorMessage: 'memberId is a required field',
    },
  },
};
