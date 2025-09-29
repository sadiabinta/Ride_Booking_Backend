import { model, Schema } from "mongoose";
import { IDriver, IDriverLocation, VehicleType } from "./driver.interface";

const driverLocationSchema = new Schema<IDriverLocation>(
  {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  {
    versionKey: false,
    _id: false,
  }
);
const driverSchema = new Schema<IDriver>(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: Object.values(VehicleType),
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    currentRideId: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      default: null,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    location: { type: driverLocationSchema },
  },
  { timestamps: true }
);

export const Driver = model<IDriver>("Driver", driverSchema);
