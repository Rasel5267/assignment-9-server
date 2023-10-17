import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { JwtPayload } from 'jsonwebtoken';
import { ReviewService } from '../review/review.service';
import sendResponse from '../../../shared/sendResponse';
import { Review } from '@prisma/client';
import httpStatus from 'http-status';
import { reviewFilterableFields } from './review.constant';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const CreateReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  const result = await ReviewService.CreateReview(user, req.body);

  sendResponse<Review>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review created successfully',
    data: result
  });
});

const GetAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await ReviewService.GetAllReviews(filters, options);

  sendResponse<Review[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const GetReviewById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const id = req.params.id;

  const result = await ReviewService.GetReviewById(user, id);

  sendResponse<Review>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieved successfully',
    data: result
  });
});

const UpdateReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ReviewService.UpdateReview(id, req.body);

  sendResponse<Review>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review status updated successfully',
    data: result
  });
});

const DeleteReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user as JwtPayload;
  const result = await ReviewService.DeleteReview(user, id);

  sendResponse<Review>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result
  });
});

export const ReviewController = {
  CreateReview,
  GetAllReviews,
  GetReviewById,
  UpdateReview,
  DeleteReview
};
