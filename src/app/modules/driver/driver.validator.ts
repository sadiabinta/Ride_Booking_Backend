import { z } from "zod";

export const driverLocationZodSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export const createDriverZodSchema = z.object({
  body: z.object({
    driverId: z.string(),
    name: z.string(),
    email: z.email(),
    address: z.string(),
    vehicleType: z.enum(["CAR", "CNG", "BIKE"]),
    vehicleNumber: z
      .string()
      .min(2, { message: "Vehicle number must be at least 2 characters" }),
    licenseNumber: z
      .string()
      .min(5, { message: "License number must be at least 5 characters" }),
  }),
});

export const updateDriverZodSchema = z.object({
  body: z.object({
    vehicleType: z.enum(["CAR", "CNG", "BIKE"]).optional(),
    vehicleNumber: z.string().min(2).optional(),
    licenseNumber: z.string().min(5).optional(),
    isApproved: z.boolean().optional(),
    isOnline: z.boolean().optional(),
    currentRideId: z.string().optional(),
    earnings: z.number().min(0).optional(),
    location: driverLocationZodSchema.optional(),
  }),
});
