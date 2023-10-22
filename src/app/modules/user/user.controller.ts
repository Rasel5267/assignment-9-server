import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { UserService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Admin, User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

const Profile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await UserService.Profile(user);

  sendResponse<User>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User retrieved successfully',
    data: result
  });
});

const CreateCustomer = catchAsync(async (req: Request, res: Response) => {
  const { customer, ...userData } = req.body;
  const result = await UserService.CreateCustomer(customer, userData);

  sendResponse<User>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Customer created successfully',
    data: result
  });
});

const CreateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { admin, ...userData } = req.body;
  const result = await UserService.CreateAdmin(admin, userData);

  sendResponse<Admin>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin created successfully',
    data: result
  });
});

export const UserController = {
  Profile,
  CreateCustomer,
  CreateAdmin
};
