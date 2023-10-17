import { Prisma, Review } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { ApiError } from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IReviewFilterRequest } from './review.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import {
  reviewRelationalFields,
  reviewRelationalFieldsMapper,
  reviewSearchableFields
} from './review.constant';

const CreateReview = async (user: JwtPayload, payload: Review): Promise<Review> => {
  const isOrderExist = await prisma.order.findFirst({
    where: {
      customerEmail: user.email,
      tourPackageId: payload.tourPackageId
    },
    include: {
      tourPackage: true
    }
  });

  if (isOrderExist === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have no order to review');
  }

  if (isOrderExist.orderStatus !== 'COMPLETED') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot reviewed before completion');
  }

  const result = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      customerEmail: user.email,
      tourPackageId: payload.tourPackageId
    }
  });

  return result;
};

const GetAllReviews = async (
  filters: IReviewFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Review[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: reviewSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (reviewRelationalFields.includes(key)) {
          return {
            [reviewRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key]
            }
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key]
            }
          };
        }
      })
    });
  }

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    include: {
      customer: true,
      tourPackage: true
    },
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
  const total = await prisma.review.count({
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

const GetReviewById = async (user: JwtPayload, id: string): Promise<Review | null> => {
  const result = await prisma.review.findUnique({
    where: {
      id: id,
      customerEmail: user.email
    }
  });

  return result;
};

const UpdateReview = async (id: string, payload: Partial<Review>): Promise<Review> => {
  const result = await prisma.review.update({
    where: {
      id
    },
    data: payload
  });

  return result;
};

const DeleteReview = async (user: JwtPayload, id: string): Promise<Review> => {
  let result = null;

  if (user.role !== 'admin' && user.role === 'customer') {
    result = await prisma.review.delete({
      where: {
        id,
        customerEmail: user.email
      }
    });
  } else {
    result = await prisma.review.delete({
      where: {
        id
      }
    });
  }

  return result;
};

export const ReviewService = {
  CreateReview,
  GetAllReviews,
  GetReviewById,
  UpdateReview,
  DeleteReview
};
