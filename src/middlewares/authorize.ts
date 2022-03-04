import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AuthorizationError } from '../errors/AuthorizationError';
import { ApiError } from '../errors/ApiError';
import ROLES from '../constants/Roles';
import 'dotenv/config';
import { Team, TeamInterface } from '../models/Team';

export const authorize =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        throw new Error('JWT Error');
      }

      const token = req.headers.authorization.split('Bearer ')[1];

      if (!token) {
        throw new Error('JWT Error');
      }

      if (!process.env.JWT_SECRET) throw new Error();

      const signature: Secret = process.env.JWT_SECRET;
      const decoded: any = jwt.verify(token, signature);
      const user = await User.findOne({
        _id: decoded.id,
      });

      if (!user) throw new Error('User is not found');
      req.user = user._id;
      next();
    } catch (exception) {
      console.log({ exception });
      res.status(403).json(new AuthorizationError(exception, 403));
    }
  };

export const teamAuthorize =
  (roles: Array<string> = ROLES) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const { team_id } = req.headers;
      const team: TeamInterface | null = await Team.findOne({
        _id: team_id,
        members: {
          $elemMatch: { id: user, role: { $in: roles } },
        },
      });
      if (!team) throw new Error();
      req.body.team = team;
      next();
    } catch (exception) {
      console.log({ exception });
      res.status(403).json(new AuthorizationError(exception, 403));
    }
  };
