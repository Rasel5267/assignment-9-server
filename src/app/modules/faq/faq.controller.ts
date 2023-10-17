import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { FAQService } from './faq.service';
import sendResponse from '../../../shared/sendResponse';
import { Faq } from '@prisma/client';
import httpStatus from 'http-status';

const CreateFAQ = catchAsync(async (req: Request, res: Response) => {
  const result = await FAQService.CreateFAQ(req.body);

  sendResponse<Faq>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ created successfully',
    data: result
  });
});

const GetAllFAQ = catchAsync(async (req: Request, res: Response) => {
  const result = await FAQService.GetAllFAQ();

  sendResponse<Faq[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQs retrieved successfully',
    data: result
  });
});

const GetFAQById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await FAQService.GetFAQById(id);

  sendResponse<Faq>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ retrieved successfully',
    data: result
  });
});

const UpdateFAQ = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await FAQService.UpdateFAQ(id, req.body);

  sendResponse<Faq>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ updated successfully',
    data: result
  });
});

const DeleteFAQ = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await FAQService.DeleteFAQ(id);

  sendResponse<Faq>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ deleted successfully',
    data: result
  });
});

export const FAQController = {
  CreateFAQ,
  GetAllFAQ,
  GetFAQById,
  UpdateFAQ,
  DeleteFAQ
};
