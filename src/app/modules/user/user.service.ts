import { Admin, Customer, User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { ApiError } from '../../../errors/ApiError';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { JwtPayload } from 'jsonwebtoken';

const Profile = async (user: JwtPayload): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      email: user.email
    },
    include: {
      customer: true,
      admin: true
    }
  });

  return result;
};

const CreateCustomer = async (customer: Customer, user: User): Promise<User | null> => {
  user.role = 'customer';

  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt));

  const isCustomerExist = prisma.customer.findUnique({
    where: {
      email: customer.email
    }
  });

  if (isCustomerExist === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Customer already exist');
  }

  let result = null;

  await prisma.$transaction(async (prismaTransactionClient) => {
    const newCustomer = await prismaTransactionClient.customer.create({
      data: customer
    });

    if (newCustomer === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create customer');
    }

    user.email = newCustomer.email;
    user.customerId = newCustomer.id;

    const newUser = await prismaTransactionClient.user.create({
      data: user,
      include: {
        customer: true
      }
    });

    if (newUser === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    result = newUser;
  });

  return result;
};

const CreateAdmin = async (admin: Admin, user: User): Promise<Admin | null> => {
  user.role = 'admin';

  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt));

  const isAdminExist = prisma.admin.findUnique({
    where: {
      email: admin.email
    }
  });

  if (isAdminExist === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin already exist');
  }

  let result = null;

  await prisma.$transaction(async (prismaTransactionClient) => {
    const newAdmin = await prismaTransactionClient.admin.create({
      data: admin
    });

    if (newAdmin === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    user.email = newAdmin.email;
    user.adminId = newAdmin.id;

    const newUser = await prismaTransactionClient.user.create({
      data: user,
      include: {
        admin: true
      }
    });

    if (newUser === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    result = newUser;
  });

  return result;
};

export const UserService = {
  Profile,
  CreateCustomer,
  CreateAdmin
};
