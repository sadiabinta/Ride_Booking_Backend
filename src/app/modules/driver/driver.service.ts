import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { Ride } from "../ride/ride.model";
import { Driver } from "./driver.model";
import AppError from "../../errorHelpers/AppError";

const approveDriver = async (payload: JwtPayload) => {
  const driverId = payload._id;
  const isApproved = payload.isApproved;
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { isApproved },
    { new: true }
  );

  return driver;
};
const getAllDrivers = async () => {
  const drivers = await Driver.find().populate(
    "driverId",
    "name email address phone picture"
  );

  return drivers;
};
const availableRequest = async () => {
  const ride = await Ride.find({ status: "REQUESTED" })
    .populate("riderId", "name phone")
    .sort({ requestedAt: -1 });

  return ride;
};
const singleAvailableRequest = async (id: string) => {
  const ride = await Ride.findById(id).populate("riderId", "name phone");

  return ride;
};
const acceptRequest = async (verifiedToken: JwtPayload, rideId: string) => {
  const ride = await Ride.findByIdAndUpdate(
    { _id: rideId, status: "REQUESTED" },
    {
      status: "ACCEPTED",
      driverId: verifiedToken.userId,
      acceptedAt: Date.now(),
    },
    { new: true, runValidators: true }
  ).populate("riderId", "name phone");

  return ride;
};
const pickedupRequest = async (verifiedToken: JwtPayload, rideId: string) => {
  const ride = await Ride.findByIdAndUpdate(
    { _id: rideId, status: "ACCEPTED" },
    {
      status: "IN_TRANSIT",
      pickedUpAt: Date.now(),
    },
    { new: true, runValidators: true }
  ).populate("riderId", "name phone");

  return ride;
};
const completedRequest = async (verifiedToken: JwtPayload, rideId: string) => {
  const ride = await Ride.findByIdAndUpdate(
    { _id: rideId, status: "IN_TRANSIT" },
    {
      status: "COMPLETED",
      completedAt: Date.now(),
    },
    { new: true, runValidators: true }
  ).populate("riderId", "name phone");

  const driver = await Driver.findOne({ driverId: verifiedToken.userId });
  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver not found");
  }
  driver.earnings += ride?.fare as number;
  await driver.save();

  return ride;
};
const earningHistory = async (verifiedToken: JwtPayload) => {
  const driverId = verifiedToken.userId;
  const driver = await Driver.findOne({ driverId: verifiedToken.userId });
  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver not found");
  }
  const rides = await Ride.find({ driverId, status: "COMPLETED" })
    .select("rideId fare completedAt")
    .populate("riderId", "name phone");

  const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

  return { totalEarnings, rides };
};
const updateAvailability = async (
  verifiedToken: JwtPayload,
  isOnline: boolean
) => {
  const driverId = verifiedToken.userId;
  const driver = await Driver.findOneAndUpdate(
    { driverId },
    { isOnline },
    { new: true }
  );
  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver not found");
  }

  return driver;
};
const updateDriverLocation = async (
  verifiedToken: JwtPayload,
  payload: JwtPayload
) => {
  const driverId = verifiedToken.userId;
  const { latitude, longitude } = payload;
  const driver = await Driver.findOneAndUpdate(
    { driverId },
    { location: { latitude, longitude }, updatedAt: new Date() },
    { new: true }
  );
  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver not found");
  }

  return driver;
};
export const DriverServices = {
  approveDriver,
  availableRequest,
  singleAvailableRequest,
  acceptRequest,
  pickedupRequest,
  completedRequest,
  earningHistory,
  updateAvailability,
  updateDriverLocation,
  getAllDrivers,
};
