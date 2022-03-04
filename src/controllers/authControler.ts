import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User, UserInterface } from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../errors/ApiError';
import * as EmailValidator from 'email-validator';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const lowerCasedEmail: string = email.toLowerCase();
    const hash: string = await bcrypt.hash(password, 10);
    const existUser: Array<UserInterface> = await User.find({
      $or: [{ email: lowerCasedEmail }],
    });
    if (existUser.length) {
      return res
        .status(409)
        .json(
          new ApiError({ message: 'Email or username already in use' }, 409)
        );
    }

    const user: UserInterface = await User.create({
      email: lowerCasedEmail,
      password: hash,
    });

    res.status(201).json({ message: 'User created successfully', data: user });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    let user: UserInterface | null = null;
    if (EmailValidator.validate(email.toLowerCase())) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = await User.findOne({ userName: email });
    }

    if (!user)
      return res
        .status(404)
        .json(new ApiError({ message: 'Wrong username or password' }, 404));

    const passwordIsValid: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordIsValid)
      return res
        .status(404)
        .json(new ApiError({ message: 'Wrong username or password' }, 404));

    const signature: Secret = process.env.JWT_SECRET!;
    const payload: JwtPayload = { id: user._id };
    const token = jwt.sign(payload, signature, {
      expiresIn: '36000s',
    });

    res.status(200).json({
      message: 'Successful login',
      token,
    });
  }
);
