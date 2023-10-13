import { Admin, Prisma, User } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IAdminFilterRequest } from './admin.interface';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { adminSearchableFields } from './admin.constant';
import prisma from '../../../shared/prisma';
import { ApiError } from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

const GetAllAdmin = async (
  filters: IAdminFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Admin[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.admin.findMany({
    include: {
      user: true
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
  const total = await prisma.admin.count({
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

const GetAdminById = async (id: string): Promise<Admin> => {
  const result = await prisma.admin.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  });

  if (result === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin not found');
  }

  return result;
};

const UpdateAdmin = async (user: JwtPayload | null, payload: Partial<Admin>): Promise<Admin> => {
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized');
  }

  const isExist = await prisma.admin.findUnique({
    where: {
      email: user.email
    }
  });

  if (isExist === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin not found');
  }

  const result = await prisma.admin.update({
    where: {
      email: user.email
    },
    data: payload
  });

  return result;
};

const DeleteAdmin = async (id: string): Promise<void> => {
  await prisma.$transaction(async (prismaTransactionClient) => {
    const isAdminExist = await prismaTransactionClient.admin.findUnique({
      where: {
        id
      }
    });

    if (isAdminExist === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Admin not found');
    }

    await prismaTransactionClient.admin.delete({
      where: {
        id
      }
    });

    await prismaTransactionClient.user.delete({
      where: {
        email: isAdminExist.email
      }
    });
  });
};

const ManageRoles = async (id: string, payload: any): Promise<User> => {
  const isExist = await prisma.admin.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  });

  if (isExist === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  if (isExist.user?.role === payload.role) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${payload.role} already given for this user`);
  }

  const result = await prisma.user.update({
    where: {
      id: isExist.user?.id
    },
    data: {
      role: payload.role
    },
    include: {
      admin: true
    }
  });

  return result;
};

export const AdminService = {
  GetAllAdmin,
  GetAdminById,
  UpdateAdmin,
  DeleteAdmin,
  ManageRoles
};
