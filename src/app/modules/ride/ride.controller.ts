/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RideServices } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";

const getAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const verifiedToken = req.user;
    const fare = await RideServices.getAllRides();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Ride fare estimated Successfully",
      data: fare,
    });
  }
);
const changeRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const verifiedToken = req.user;
    const fare = await RideServices.changeRole(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Role Changed Successfully",
      data: fare,
    });
  }
);
const rideFareEstimate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const verifiedToken = req.user;
    const fare = await RideServices.rideFareEstimate(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Ride fare estimated Successfully",
      data: fare,
    });
  }
);
const requestRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const verifiedToken = req.user;
    const ride = await RideServices.requestRide(
      payload,
      verifiedToken as JwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Ride requested Successfully",
      data: ride,
    });
  }
);
const cancelRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const verifiedToken = req.user;
    const ride = await RideServices.cancelRide(
      rideId,
      verifiedToken as JwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Ride request is cancelled",
      data: ride,
    });
  }
);
const getRideHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user;
    const ride = await RideServices.getRideHistory(verifiedToken as JwtPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Ride History Retrieved",
      data: ride,
    });
  }
);

//driver
// const availableRequest = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // const verifiedToken = req.user;
//     const ride = await RideServices.availableRequest();
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Requested Ride Retrieved",
//       data: ride,
//     });
//   }
// );
// const acceptRequest = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const verifiedToken = req.user;
//     const { rideId } = req.params;
//     const ride = await RideServices.acceptRequest(
//       verifiedToken as JwtPayload,
//       rideId
//     );
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Requested Ride is accepted",
//       data: ride,
//     });
//   }
// );
// const pickedupRequest = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const verifiedToken = req.user;
//     const { rideId } = req.params;
//     const ride = await RideServices.pickedupRequest(
//       verifiedToken as JwtPayload,
//       rideId
//     );
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Passenger picked up and ride started",
//       data: ride,
//     });
//   }
// );
// const completedRequest = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const verifiedToken = req.user;
//     const { rideId } = req.params;
//     const ride = await RideServices.completedRequest(
//       verifiedToken as JwtPayload,
//       rideId
//     );
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Ride is completed",
//       data: ride,
//     });
//   }
// );
// const earningHistory = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const verifiedToken = req.user;
//     const ride = await RideServices.earningHistory(verifiedToken as JwtPayload);
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Earning History Retrieved!",
//       data: ride,
//     });
//   }
// );
// const updateAvailability = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const verifiedToken = req.user;
//     const { isOnline } = req.body;
//     const ride = await RideServices.updateAvailability(
//       verifiedToken as JwtPayload,
//       isOnline
//     );
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: `Driver's Availability Changed`,
//       data: ride,
//     });
//   }
// );
// const updateDriverLocation = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const verifiedToken = req.user;
//     const payload = req.body;
//     const ride = await RideServices.updateDriverLocation(
//       verifiedToken as JwtPayload,
//       payload
//     );
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: `Driver's location Updated`,
//       data: ride,
//     });
//   }
// );
export const RideControllers = {
  getAllRides,
  changeRole,
  rideFareEstimate,
  requestRide,
  cancelRide,
  getRideHistory,
};
