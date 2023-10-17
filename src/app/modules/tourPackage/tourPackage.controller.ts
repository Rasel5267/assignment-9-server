import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { TourPackageService } from './tourPackage.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { TourPackage } from '@prisma/client';
import { tourPackageFilterableFields } from './tourPackage.constant';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const CreateTourPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await TourPackageService.CreateTourPackage(req.body);

  sendResponse<TourPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour Package created successfully',
    data: result
  });
});

const GetAllTourPackages = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, tourPackageFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await TourPackageService.GetAllTourPackages(filters, options);

  sendResponse<TourPackage[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour Packages retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const GetTourPackageById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourPackageService.GetTourPackageById(id);

  sendResponse<TourPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour Package retrieved successfully',
    data: result
  });
});

const UpdateTourPackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourPackageService.UpdateTourPackage(id, req.body);

  sendResponse<TourPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour Package updated successfully',
    data: result
  });
});

const UpdateTourPackageStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourPackageService.UpdateTourPackage(id, req.body);

  sendResponse<TourPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour Package status updated successfully',
    data: result
  });
});

const DeleteTourPackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourPackageService.DeleteTourPackage(id);

  sendResponse<TourPackage>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tour Package deleted successfully',
    data: result
  });
});

export const TourPackageController = {
  CreateTourPackage,
  GetAllTourPackages,
  GetTourPackageById,
  UpdateTourPackage,
  UpdateTourPackageStatus,
  DeleteTourPackage
};
