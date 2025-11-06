import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Driver } from "../driver/driver.model";
import { IDriver } from "../driver/driver.interface";

const createUser = async (payload: Partial<IUser> & IDriver) => {
  const { email, password, role, ...rest } = payload;
  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
  }
  if (payload.role == "ADMIN") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Can not create account as an ADMIN!!"
    );
  }
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    ...rest,
    email,
    password: hashedPassword,
    role: role || Role.RIDER,
    auths: [authProvider],
  });
  if (user.role == Role.DRIVER) {
    const driver = await Driver.create({
      driverId: user._id,
      name: user.name,
      phone: user.phone,
      vehicleType: payload.vehicleType,
      licenseNumber: payload.licenseNumber,
      vehicleNumber: payload.vehicleNumber,
      isApproved: false,
      isOnline: false,
      earnings: 0,
    });
    const populatedDriver = await Driver.findById(driver._id)
      .populate("driverId", "name phone email address")
      .lean();
    console.log(populatedDriver);

    return {
      user: user.toObject(),
      driver: populatedDriver,
    };
  }

  return {
    user,
  };
};
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExists = await User.findById(userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User Do not Exists");
  }
  if (payload.role) {
    if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
      throw new AppError(httpStatus.FORBIDDEN, "You Are not authorized");
    }
    if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You Are not authorized to update Role"
      );
    }
  }
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "You Are not authorized");
  }
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }
  const newUpdateduser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdateduser;
};
const getAllUser = async () => {
  const users = await User.find();
  const totalUser = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};
const getMe = async (decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "No user found");
  }
  if (user.role === "DRIVER") {
    const driver = await Driver.findOne({ driverId: user._id });
    return {
      // data: { ...user, driverDetails: driver },
      data: { user: user, driver: driver },
    };
  }
  return {
    data: { user: user },
  };
};

export const UserService = {
  createUser,
  getAllUser,
  getMe,
  updateUser,
};
