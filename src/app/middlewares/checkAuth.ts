import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import { Driver } from "../modules/driver/driver.model";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(403, "No token received");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExists = await User.findOne({ email: verifiedToken.email });
      if (!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Do not Exists!");
      }
      if (Role.DRIVER) {
        const driver = await Driver.findOne({ driverId: isUserExists._id });
        if (driver?.isApproved === false) {
          throw new AppError(httpStatus.BAD_REQUEST, "Driver not approved");
        }
      }
      if (
        isUserExists.isActive === IsActive.BLOCKED ||
        isUserExists.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExists.isActive}`
        );
      }
      if (isUserExists.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is Deteled`);
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this Route");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
