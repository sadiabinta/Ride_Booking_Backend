import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema } from "./ride.validator";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideControllers } from "./ride.controller";

const router = Router();

router.post("/estimate", RideControllers.rideFareEstimate);
router.get("/getAllRides", checkAuth(Role.ADMIN), RideControllers.getAllRides);
router.patch("/changeRole", checkAuth(Role.ADMIN), RideControllers.changeRole);
router.post(
  "/request",
  validateRequest(createRideZodSchema),
  checkAuth(Role.RIDER),
  RideControllers.requestRide
);
router.get(
  "/history",
  checkAuth(Role.ADMIN, Role.RIDER),
  RideControllers.getRideHistory
);
router.patch(
  "/:id/cancel",
  checkAuth(...Object.values(Role)),
  RideControllers.cancelRide
);

export const RideRoutes = router;
