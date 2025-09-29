/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IsActive, IUser } from "../user/user.interface";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExists = await User.findOne({ email });
  if (!isUserExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User Do not Exists!Please Register..."
    );
  }
  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExists?.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const userToken = createUserTokens(isUserExists);

  const { password: pass, ...rest } = isUserExists.toObject();
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  // console.log(decodedToken);
  // if (!user || !user.password) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "No user Found");
  // }
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user?.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password Does not match");
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user?.save();

  return true;
};

export const AuthServices = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
};
