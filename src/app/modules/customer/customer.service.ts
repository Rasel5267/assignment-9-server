import { Customer, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { ICustomerFilterRequest } from './customer.interface';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { customerSearchableFields } from './customer.constant';
import { ApiError } from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

const GetAllCustomers = async (
  filters: ICustomerFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Customer[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: customerSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.CustomerWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.customer.findMany({
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
  const total = await prisma.customer.count({
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

const GetCustomerById = async (id: string): Promise<Customer> => {
  const result = await prisma.customer.findUnique({
    where: {
      id
    }
  });

  if (result === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer not found');
  }

  return result;
};

const UpdateCustomer = async (
  user: JwtPayload | null,
  payload: Partial<Customer>
): Promise<Customer> => {
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized');
  }

  const isExist = await prisma.customer.findUnique({
    where: {
      email: user.email
    }
  });

  if (isExist === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer not found');
  }

  const result = await prisma.customer.update({
    where: {
      email: user.email
    },
    data: payload
  });

  return result;
};

const DeleteCustomer = async (id: string): Promise<void> => {
  await prisma.$transaction(async (prismaTransactionClient) => {
    const isCustomerExist = await prismaTransactionClient.customer.findUnique({
      where: {
        id
      }
    });

    if (isCustomerExist === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Customer not found');
    }

    await prismaTransactionClient.customer.delete({
      where: {
        id
      }
    });

    await prismaTransactionClient.user.delete({
      where: {
        email: isCustomerExist.email
      }
    });
  });
};

export const CustomerService = {
  GetAllCustomers,
  GetCustomerById,
  UpdateCustomer,
  DeleteCustomer
};
