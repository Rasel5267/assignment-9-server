import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { adminFilterableFields } from './admin.constant';
import { AdminService } from './admin.service';
import sendResponse from '../../../shared/sendResponse';
import { Admin, User } from '@prisma/client';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { JwtPayload } from 'jsonwebtoken';

const GetAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await AdminService.GetAllAdmin(filters, options);

  sendResponse<Admin[]>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admins retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const GetAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.GetAdminById(id);

  sendResponse<Admin>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin retrieved successfully',
    data: result
  });
});

const UpdateAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AdminService.UpdateAdmin(id, req.body);

  sendResponse<Admin>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin updated successfully',
    data: result
  });
});

const DeleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await AdminService.DeleteAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin deleted successfully'
  });
});

const ManageRoles = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminService.ManageRoles(id, req.body);

  sendResponse<User>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User role updated successfully',
    data: result
  });
});

export const AdminController = {
  GetAllAdmins,
  GetAdminById,
  UpdateAdmin,
  DeleteAdmin,
  ManageRoles
};
