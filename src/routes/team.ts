import express, { Router } from 'express';
import * as Schemas from './validationSchemas/teamSchemas';
import { checkSchema } from 'express-validator';
import { validate } from '../middlewares/validate';
import { authorize, teamAuthorize } from '../middlewares/authorize';
import * as teamController from '../controllers/teamController';

const teamRouter: Router = express.Router();

teamRouter.get('/', authorize(), teamController.getTeams);

teamRouter.post(
  '/',
  authorize(),
  checkSchema(Schemas.createSchema),
  validate,
  teamController.createTeam
);

teamRouter.put(
  '/add-member',
  authorize(),
  teamAuthorize(['manager']),
  checkSchema(Schemas.addMemberSchema),
  validate,
  teamController.addMember
);

teamRouter.put(
  '/change-role',
  authorize(),
  teamAuthorize(['manager']),
  checkSchema(Schemas.memberIdSchema),
  validate,
  teamController.changeRole
);

teamRouter.delete(
  '/',
  authorize(),
  teamAuthorize(['manager']),
  teamController.deleteTeam
);

teamRouter.delete(
  '/delete-member',
  authorize(),
  teamAuthorize(['manager']),
  checkSchema(Schemas.memberIdSchema),
  validate,
  teamController.deleteMember
);

export { teamRouter };
