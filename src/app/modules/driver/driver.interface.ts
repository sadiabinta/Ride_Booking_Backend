import { Types } from "mongoose";

export interface IDriverLocation {
  latitude: number;
  longitude: number;
}
export enum VehicleType {
  CAR = "CAR",
  CNG = "CNG",
  BIKE = "BIKE",
}
export interface IDriver {
  driverId: Types.ObjectId;
  vehicleType: VehicleType;
  vehicleNumber: string;
  licenseNumber: string;
  isApproved: boolean;
  isOnline: boolean;
  currentRideId?: Types.ObjectId | null;
  earnings: number;
  createdAt?: Date;
  location?: IDriverLocation;
}
