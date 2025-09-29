import { Types } from "mongoose";

export interface ILocation {
  address: string;
  latitude: number;
  longitude: number;
}
export enum RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}
export enum CanceledBy {
  RIDER = "RIDER",
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
}
export interface IRide {
  _id?: Types.ObjectId;
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId | null;
  offeredDriver?: Types.ObjectId | null;
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  status: RideStatus;
  fare?: number;
  distance?: number;
  requestedAt?: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  canceledAt?: Date;
  canceledBy?: CanceledBy;
  createdAt?: Date;
  updatedAt?: Date;
}
