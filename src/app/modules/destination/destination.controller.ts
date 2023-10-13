import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DestinationService } from './destination.service';
import sendResponse from '../../../shared/sendResponse';
import { Destination } from '@prisma/client';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { destinationFilterableFields } from './destination.constant';

const CreateDestination = catchAsync(async (req: Request, res: Response) => {
  const result = await DestinationService.CreateDestination(req.body);

  sendResponse<Destination>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Destination created successfully',
    data: result
  });
});

const GetAllDestinations = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, destinationFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await DestinationService.GetAllDestinations(filters, options);

  sendResponse<Destination[]>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Destinations retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const GetDestinationById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DestinationService.GetDestinationById(id);

  sendResponse<Destination>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Destination retrieved successfully',
    data: result
  });
});

const UpdateDestination = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DestinationService.UpdateDestination(id, req.body);

  sendResponse<Destination>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Destination updated successfully',
    data: result
  });
});

export const DestinationController = {
  CreateDestination,
  GetAllDestinations,
  GetDestinationById,
  UpdateDestination
};
