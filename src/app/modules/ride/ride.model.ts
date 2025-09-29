import { Schema, model } from "mongoose";
import { IRide, RideStatus, CanceledBy, ILocation } from "./ride.interface";

const locationSchema = new Schema<ILocation>(
  {
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const rideSchema = new Schema<IRide>(
  {
    // _id: { type: Schema.Types.ObjectId },
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    offeredDriver: { type: Schema.Types.ObjectId, ref: "User", default: null },
    pickupLocation: { type: locationSchema, required: true },
    destinationLocation: { type: locationSchema, required: true },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.REQUESTED,
    },
    fare: { type: Number, default: 0 },
    distance: { type: Number, default: 0 },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    completedAt: { type: Date },
    canceledAt: { type: Date },
    canceledBy: {
      type: String,
      enum: Object.values(CanceledBy),
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Ride = model<IRide>("Ride", rideSchema);
