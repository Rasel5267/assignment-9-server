import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BlogService } from './blog.service';
import httpStatus from 'http-status';
import { Blog } from '@prisma/client';
import pick from '../../../shared/pick';
import { blogFilterableFields } from './blog.constant';
import { paginationFields } from '../../../constants/pagination';

const CreateBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.CreateBlog(req.body);

  sendResponse<Blog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog created successfully',
    data: result
  });
});

const GetAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, blogFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await BlogService.GetAllBlogs(filters, options);

  sendResponse<Blog[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const GetBlogById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BlogService.GetBlogById(id);

  sendResponse<Blog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog retrieved successfully',
    data: result
  });
});

const UpdateBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BlogService.UpdateBlog(id, req.body);

  sendResponse<Blog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result
  });
});

const DeleteBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BlogService.DeleteBlog(id);

  sendResponse<Blog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: result
  });
});

export const BlogController = {
  CreateBlog,
  GetAllBlogs,
  GetBlogById,
  UpdateBlog,
  DeleteBlog
};
