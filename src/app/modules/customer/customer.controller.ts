import { Customer } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { CustomerService } from './customer.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { customerFilterableFields } from './customer.constant';
import { paginationFields } from '../../../constants/pagination';
import { JwtPayload } from 'jsonwebtoken';

const GetAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, customerFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await CustomerService.GetAllCustomers(filters, options);

  sendResponse<Customer[]>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Customers retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const GetCustomerById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CustomerService.GetCustomerById(id);

  sendResponse<Customer>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Customer retrieved successfully',
    data: result
  });
});

const UpdateCustomer = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await CustomerService.UpdateCustomer(user, req.body);

  sendResponse<Customer>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Customer updated successfully',
    data: result
  });
});

const DeleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CustomerService.DeleteCustomer(id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Customer deleted successfully'
  });
});

export const CustomerController = {
  GetAllCustomers,
  GetCustomerById,
  UpdateCustomer,
  DeleteCustomer
};
