import z from "zod";
import { CanceledBy, RideStatus } from "./ride.interface";

export const locationZodSchema = z.object({
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters long." }),
  latitude: z.number(),
  longitude: z.number(),
});

export const createRideZodSchema = z.object({
  // _id: z.string().optional(),
  driverId: z.string().optional(),
  pickupLocation: locationZodSchema,
  destinationLocation: locationZodSchema,
  status: z.enum(Object.values(RideStatus) as [string]).optional(),
  fare: z.number().optional(),
  distance: z.number().optional(),
});
export const updateRideZodSchema = z.object({
  driverId: z.string().optional(),
  offeredDriver: z.string().optional(),
  pickupLocation: locationZodSchema.optional(),
  destinationLocation: locationZodSchema.optional(),
  status: z.enum(Object.values(RideStatus) as [string]).optional(),
  fare: z.number().optional(),
  distance: z.number().optional(),
  acceptedAt: z.date().optional(),
  pickedUpAt: z.date().optional(),
  completedAt: z.date().optional(),
  canceledAt: z.date().optional(),
  canceledBy: z.enum(Object.values(CanceledBy) as [string]).optional(),
});
