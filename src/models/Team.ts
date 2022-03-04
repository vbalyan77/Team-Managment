import { Schema, model, Types } from 'mongoose';
import Roles from '../constants/Roles';

export interface MemberInterface {
  id: any;
  role?: string;
}

export interface TeamInterface {
  members: Array<MemberInterface>;
  title: string;
  _id?: string;
}

const membersSchema = new Schema<MemberInterface>(
  {
    id: {
      type: Types.ObjectId,
      required: true,
    },
    role: {
      type: String,
      enum: Roles,
      default: 'regular_user',
    },
  },
  { _id: false }
);

const teamSchema = new Schema<TeamInterface>(
  {
    members: {
      type: [membersSchema],
      default: [],
      ref: 'users, roles',
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Team = model<TeamInterface>('Team', teamSchema);
