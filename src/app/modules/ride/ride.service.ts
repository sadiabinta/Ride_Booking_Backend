/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { IRide } from "./ride.interface";
import { Ride } from "./ride.model";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { calculateFare } from "../../utils/calculateFare";
import { getDistance } from "../../utils/calculateDistance";
import { Driver } from "../driver/driver.model";

const getAllRides = async () => {
  const rides = await Ride.find().populate("riderId", "name phone role");
  return rides;
};
const changeRole = async (payload: JwtPayload) => {
  const userId = payload.id;
  const role = payload.role;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { role },
    { new: true }
  );

  return user;
};
const rideFareEstimate = async (payload: Partial<IRide>) => {
  const { pickupLocation, destinationLocation } = payload;
  const distance = getDistance(
    pickupLocation?.latitude as number,
    pickupLocation?.longitude as number,
    destinationLocation?.latitude as number,
    destinationLocation?.longitude as number
  );
  const fare = calculateFare(distance);

  return fare;
};
const requestRide = async (
  payload: Partial<IRide>,
  verifiedToken: JwtPayload
) => {
  const riderId = verifiedToken.userId;
  const { pickupLocation, destinationLocation } = payload;
  const isUserExists = await User.findById(riderId);
  if (!isUserExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please register to request a Ride"
    );
  }
  const distance = getDistance(
    pickupLocation?.latitude as number,
    pickupLocation?.longitude as number,
    destinationLocation?.latitude as number,
    destinationLocation?.longitude as number
  );
  const fare = calculateFare(distance);
  const ride = await Ride.create({
    riderId,
    pickupLocation,
    destinationLocation,
    estimatedTime: fare.estimatedTimeMin,
    fare: fare.fare,
    distance: distance,
  });

  const drivers = await Driver.find({ isOnline: true });
  let nearestDriver;
  let minDistance = Infinity;
  for (const driver of drivers) {
    if (!driver.location) continue;
    const d = getDistance(
      pickupLocation?.latitude as number,
      pickupLocation?.longitude as number,
      driver.location.latitude,
      driver.location.longitude
    );
    if (d < minDistance) {
      minDistance = d;
      nearestDriver = driver;
    }
  }
  if (nearestDriver) {
    ride.offeredDriver = nearestDriver._id;
    await ride.save();
  }
  return ride;
};
const cancelRide = async (rideId: string, verifiedToken: JwtPayload) => {
  const isRideExists = await Ride.findById(rideId).populate("riderId");
  if (!isRideExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "No ride Found to cancel!!");
  }
  if (["CANCELED", "COMPLETED", "IN_TRANSIT"].includes(isRideExists.status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Ride can not be canceled!!");
  }
  const role = verifiedToken.role;

  const ride = await Ride.findByIdAndUpdate(
    rideId,
    { status: "CANCELED", canceledAt: new Date(), canceledBy: role },
    {
      new: true,
      runValidators: true,
    }
  );

  return ride;
};
const getRideHistory = async (verifiedToken: JwtPayload) => {
  const ride = await Ride.find(verifiedToken.riderId);

  return ride;
};
//driver
const availableRequest = async () => {
  const ride = await Ride.find({ status: "REQUESTED" })
    .populate("riderId", "name phone")
    .sort({ requestedAt: -1 });

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
export const RideServices = {
  changeRole,
  getAllRides,
  rideFareEstimate,
  requestRide,
  cancelRide,
  getRideHistory,
  availableRequest,
  acceptRequest,
  pickedupRequest,
  completedRequest,
  earningHistory,
  updateAvailability,
  updateDriverLocation,
};
