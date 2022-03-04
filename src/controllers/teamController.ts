import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { Team, TeamInterface, MemberInterface } from '../models/Team';
import { User, UserInterface } from '../models/User';
import { ApiError } from '../errors/ApiError';

export const getTeams = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const teams: Array<TeamInterface> = await Team.find({
      members: { $elemMatch: { id: user } },
    });
    res.status(200).json({ message: 'Your teams ', data: teams });
  }
);

export const createTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { title } = req.body;

    const group: TeamInterface = await Team.create({
      title,
      members: [{ id: user, role: 'manager' }],
    });

    res.status(201).json({ message: 'Team created succesfuly', data: group });
  }
);

export const addMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { users, team } = req.body;

    let newMembers: Array<MemberInterface> = [];
    if (Array.isArray(users)) {
      users.forEach((user) => {
        newMembers.push({ id: user });
      });
    } else newMembers = [{ id: users }];

    for (const user of newMembers) {
      const userExist: UserInterface | null = await User.findById(user.id);
      if (
        !userExist ||
        team.members.find((member: MemberInterface) => member.id == user.id)
      )
        continue;
      team.members.push(user);
    }
    team.save();

    res.status(201).json({
      message: 'Members successfuly added in the group',
    });
  }
);

export const deleteMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const { memberId, team } = req.body;

    if (memberId == user)
      return res
        .status(403)
        .json(new ApiError({ message: "You can't delete yourself" }, 403));

    let existMember: boolean = false;
    for (const member of team.members) {
      if (member.id == memberId) {
        const index = team.members.indexOf(member);
        team.members.splice(index, 1);
        existMember = true;
      }
    }
    if (!existMember)
      return res
        .status(404)
        .json(new ApiError({ message: 'Member is not in the group ' }, 404));

    team.save();
    res.status(200).json({
      message: 'Member successfuly deleted from the team',
    });
  }
);

export const deleteTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { team } = req.body;
    team.remove();
    res.status(200).json({
      message: 'Team successfuly deleted',
    });
  }
);

export const changeRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { memberId, team } = req.body;
    const member: MemberInterface = team.members.find(
      (curMember: MemberInterface) => curMember.id == memberId
    );
    if (!member)
      return res
        .status(404)
        .json(new ApiError({ message: 'Member is not in the group ' }, 404));
    member.role = 'manager';
    team.save();
    res.status(200).json({
      message: 'Member role successfuly updated',
    });
  }
);
