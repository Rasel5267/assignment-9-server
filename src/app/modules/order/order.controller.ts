import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { JwtPayload } from 'jsonwebtoken';
import sendResponse from '../../../shared/sendResponse';
import { Order } from '@prisma/client';
import httpStatus from 'http-status';
import { OrderService } from './order.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { orderFilterableFields } from './order.constant';

const CreateOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  const result = await OrderService.CreateOrder(user, req.body);

  sendResponse<Order>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result
  });
});

const GetAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await OrderService.GetAllOrders(filters, options);

  sendResponse<Order[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const GetOrderById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const id = req.params.id;

  const result = await OrderService.GetOrderById(user, id);

  sendResponse<Order>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result
  });
});

const UpdateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await OrderService.UpdateOrderStatus(id, req.body.orderStatus);

  sendResponse<Order>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result
  });
});

const DeleteOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await OrderService.DeleteOrderStatus(id);

  sendResponse<Order>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result
  });
});

export const OrderController = {
  CreateOrder,
  GetAllOrders,
  GetOrderById,
  UpdateOrderStatus,
  DeleteOrder
};
