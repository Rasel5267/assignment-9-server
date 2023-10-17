import { Blog, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { blogSearchableFields } from './blog.constant';
import { IBlogFilterRequest } from './blog.interface';

const CreateBlog = async (payload: Blog): Promise<Blog> => {
  const result = await prisma.blog.create({
    data: payload
  });

  return result;
};

const GetAllBlogs = async (
  filters: IBlogFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Blog[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: blogSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key]
        }
      }))
    });
  }

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc'
          }
  });
  const total = await prisma.blog.count({
    where: whereConditions
  });

  return {
    meta: {
      total,
      page,
      limit
    },
    data: result
  };
};

const GetBlogById = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.findUnique({
    where: {
      id
    }
  });

  return result;
};

const UpdateBlog = async (id: string, payload: Partial<Blog>): Promise<Blog | null> => {
  const result = await prisma.blog.update({
    where: {
      id
    },
    data: payload
  });

  return result;
};

const DeleteBlog = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.delete({
    where: {
      id
    }
  });

  return result;
};

export const BlogService = {
  CreateBlog,
  GetAllBlogs,
  GetBlogById,
  UpdateBlog,
  DeleteBlog
};
