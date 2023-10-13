import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelper';
import {
  IChengePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse
} from './auth.interface';
import prisma from '../../../shared/prisma';
import { ApiError } from '../../../errors/ApiError';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';

const Login = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  // Check user exists
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email
    }
  });

  if (isUserExist === null) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // match password
  if (isUserExist.password && !(await bcrypt.compare(payload.password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { email, role } = isUserExist;
  // create access token
  const accessToken = jwtHelpers.createToken(
    {
      email,
      role
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // create refresh token
  const refreshToken = jwtHelpers.createToken(
    {
      email,
      role
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken
  };
};

const RefreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.refresh_secret as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { email } = verifiedToken;
  // Check user exists
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (isUserExist === null) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const { email: existingUserEmail, role } = isUserExist;

  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      email: existingUserEmail,
      role: role
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken
  };
};

const ChangePassword = async (user: JwtPayload | null, payload: IChengePassword): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is null');
  }

  // Check user exists
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: user.email
    }
  });

  if (isUserExist === null) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // checking old password
  if (isUserExist.password && !(await bcrypt.compare(oldPassword, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }

  const hashPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt));

  await prisma.user.update({
    where: {
      email: user.email
    },
    data: {
      password: hashPassword
    }
  });
};

export const AuthService = {
  Login,
  RefreshToken,
  ChangePassword
};
