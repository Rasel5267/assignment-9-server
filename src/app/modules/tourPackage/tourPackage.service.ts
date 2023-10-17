import { OrderStatus, Prisma, TourPackage } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { ITourPackageFilterRequest } from './tourPackage.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import {
  tourPackageRelationalFields,
  tourPackageRelationalFieldsMapper,
  tourPackageSearchableFields
} from './tourPackage.constant';

const CreateTourPackage = async (payload: TourPackage): Promise<TourPackage> => {
  const result = await prisma.tourPackage.create({
    data: payload
  });

  return result;
};

const GetAllTourPackages = async (
  filters: ITourPackageFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<TourPackage[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: tourPackageSearchableFields.map((field) => ({
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
        if (tourPackageRelationalFields.includes(key)) {
          return {
            [tourPackageRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.TourPackageWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.tourPackage.findMany({
    include: {
      destination: true
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
  const total = await prisma.tourPackage.count({
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

const GetTourPackageById = async (id: string): Promise<TourPackage | null> => {
  const result = await prisma.tourPackage.findUnique({
    where: {
      id
    },
    include: {
      destination: true
    }
  });

  return result;
};

const UpdateTourPackage = async (
  id: string,
  payload: Partial<TourPackage>
): Promise<TourPackage | null> => {
  const result = await prisma.tourPackage.update({
    where: {
      id
    },
    data: payload,
    include: {
      destination: true
    }
  });

  return result;
};

const UpdateTourPackageStatus = async (id: string, payload: any): Promise<TourPackage | null> => {
  const result = await prisma.tourPackage.update({
    where: {
      id
    },
    data: {
      status: payload.status
    },
    include: {
      destination: true
    }
  });

  return result;
};

const DeleteTourPackage = async (id: string): Promise<TourPackage> => {
  const result = await prisma.tourPackage.delete({
    where: {
      id
    },
    include: {
      destination: true
    }
  });

  return result;
};

export const TourPackageService = {
  CreateTourPackage,
  GetAllTourPackages,
  GetTourPackageById,
  UpdateTourPackage,
  UpdateTourPackageStatus,
  DeleteTourPackage
};
