import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DriverControllers } from "./driver.controller";

const router = Router();
router.get("/", checkAuth(Role.ADMIN), DriverControllers.getAllDrivers);
router.patch(
  "/approve",
  checkAuth(Role.ADMIN),
  DriverControllers.approveDriver
);
router.get(
  "/available",
  checkAuth(Role.DRIVER),
  DriverControllers.availableRequest
);
router.get(
  "/available/:id",
  checkAuth(Role.DRIVER),
  DriverControllers.singleAvailableRequest
);
router.patch(
  "/:rideId/accept",
  checkAuth(Role.DRIVER),
  DriverControllers.acceptRequest
);
router.patch(
  "/:rideId/pickup",
  checkAuth(Role.DRIVER),
  DriverControllers.pickedupRequest
);
router.patch(
  "/:rideId/complete",
  checkAuth(Role.DRIVER),
  DriverControllers.completedRequest
);
router.get(
  "/history",
  checkAuth(Role.DRIVER),
  DriverControllers.earningHistory
);
router.patch(
  "/availability",
  checkAuth(Role.DRIVER),
  DriverControllers.updateAvailability
);
router.patch(
  "/updateLocation",
  checkAuth(Role.DRIVER),
  DriverControllers.updateDriverLocation
);

export const DriverRoutes = router;
