import { Destination, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { ApiError } from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IDestinationFilterRequest } from './destination.interface';
import { destinationSearchableFields } from './destination.constant';

const CreateDestination = async (payload: Destination): Promise<Destination> => {
  const isExist = await prisma.destination.findFirst({
    where: {
      destinationName: payload.destinationName
    }
  });

  if (isExist != null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Destination already exists');
  }

  const result = await prisma.destination.create({
    data: payload
  });

  return result;
};

const GetAllDestinations = async (
  filters: IDestinationFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Destination[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: destinationSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.DestinationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.destination.findMany({
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
  const total = await prisma.destination.count({
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

const GetDestinationById = async (id: string): Promise<Destination | null> => {
  const result = await prisma.destination.findUnique({
    where: {
      id
    }
  });

  return result;
};

const UpdateDestination = async (
  id: string,
  payload: Partial<Destination>
): Promise<Destination> => {
  const isExist = await prisma.destination.findUnique({
    where: {
      id
    }
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Destination not found');
  }

  const result = await prisma.destination.update({
    where: {
      id
    },
    data: payload
  });

  return result;
};

const DeleteDestination = async (id: string): Promise<Destination> => {
  const result = await prisma.destination.delete({
    where: {
      id
    },
    include: {
      tourPackages: true
    }
  });

  return result;
};

export const DestinationService = {
  CreateDestination,
  GetAllDestinations,
  GetDestinationById,
  UpdateDestination,
  DeleteDestination
};
