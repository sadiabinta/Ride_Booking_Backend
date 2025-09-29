/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { DriverServices } from "./driver.service";

const approveDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const driver = await DriverServices.approveDriver(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Driver is APPROVED",
      data: driver,
    });
  }
);
const availableRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const verifiedToken = req.user;
    const ride = await DriverServices.availableRequest();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Requested Ride Retrieved",
      data: ride,
    });
  }
);
const acceptRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user;
    const { rideId } = req.params;
    const ride = await DriverServices.acceptRequest(
      verifiedToken as JwtPayload,
      rideId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Requested Ride is accepted",
      data: ride,
    });
  }
);
const pickedupRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user;
    const { rideId } = req.params;
    const ride = await DriverServices.pickedupRequest(
      verifiedToken as JwtPayload,
      rideId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Passenger picked up and ride started",
      data: ride,
    });
  }
);
const completedRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user;
    const { rideId } = req.params;
    const ride = await DriverServices.completedRequest(
      verifiedToken as JwtPayload,
      rideId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Ride is completed",
      data: ride,
    });
  }
);
const earningHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user;
    const ride = await DriverServices.earningHistory(
      verifiedToken as JwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Earning History Retrieved!",
      data: ride,
    });
  }
);
const updateAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user;
    const { isOnline } = req.body;
    const ride = await DriverServices.updateAvailability(
      verifiedToken as JwtPayload,
      isOnline
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: `Driver's Availability Changed`,
      data: ride,
    });
  }
);
const updateDriverLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user;
    const payload = req.body;
    const ride = await DriverServices.updateDriverLocation(
      verifiedToken as JwtPayload,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: `Driver's location Updated`,
      data: ride,
    });
  }
);

export const DriverControllers = {
  approveDriver,
  availableRequest,
  acceptRequest,
  pickedupRequest,
  completedRequest,
  earningHistory,
  updateAvailability,
  updateDriverLocation,
};
