import { Order, OrderStatus, Prisma } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { IOrderFilterRequest } from './order.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import {
  orderRelationalFields,
  orderRelationalFieldsMapper,
  orderSearchableFields
} from './order.constant';

const CreateOrder = async (user: JwtPayload, payload: Order): Promise<Order> => {
  const isOrderExist = await prisma.order.findFirst({
    where: {
      customerEmail: user.email,
      id: payload.id
    },
    include: {
      tourPackage: true
    }
  });
  let result = null;
  if (isOrderExist) {
    result = await prisma.order.update({
      where: {
        id: isOrderExist.id
      },
      data: {
        quantity: isOrderExist.quantity + payload.quantity
      }
    });
  } else {
    const findPackage = await prisma.tourPackage.findUnique({
      where: {
        id: payload.id
      }
    });

    result = await prisma.order.create({
      data: {
        quantity: payload.quantity,
        price: findPackage!.price * payload.quantity,
        travelDate: findPackage!.departureDate,
        customerEmail: user.email,
        tourPackageId: payload.tourPackageId
      }
    });
  }

  return result;
};

const GetAllOrders = async (
  filters: IOrderFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Order[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: orderSearchableFields.map((field) => ({
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
        if (orderRelationalFields.includes(key)) {
          return {
            [orderRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
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
  const total = await prisma.order.count({
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

const GetOrderById = async (user: JwtPayload, id: string): Promise<Order | null> => {
  let result = null;
  if (user.role !== 'admin' && user.role === 'customer') {
    result = await prisma.order.findUnique({
      where: {
        id: id,
        customerEmail: user.email
      }
    });
  } else {
    result = await prisma.order.findUnique({
      where: {
        id
      }
    });
  }

  return result;
};

const UpdateOrderStatus = async (id: string, payload: OrderStatus): Promise<Order> => {
  const result = await prisma.order.update({
    where: {
      id
    },
    data: {
      orderStatus: payload
    }
  });

  return result;
};

const DeleteOrderStatus = async (id: string): Promise<Order> => {
  const result = await prisma.order.delete({
    where: {
      id
    }
  });

  return result;
};

export const OrderService = {
  CreateOrder,
  GetAllOrders,
  GetOrderById,
  UpdateOrderStatus,
  DeleteOrderStatus
};
