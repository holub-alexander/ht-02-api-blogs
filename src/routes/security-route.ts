import express from "express";
import { verifyRefreshJwtToken } from "../middleware/custom/jwt-auth";

import { securityDevicesController } from "../data-layer/composition-root";

export const securityRouter = express.Router();

securityRouter.get(
  "/devices",
  verifyRefreshJwtToken,
  securityDevicesController.getAllDevicesWithActiveSessionsForUserHandler.bind(securityDevicesController)
);
securityRouter.delete(
  "/devices",
  verifyRefreshJwtToken,
  securityDevicesController.deleteAllDevicesWithActiveSessionsHandler.bind(securityDevicesController)
);
securityRouter.delete(
  "/devices/:deviceId",
  verifyRefreshJwtToken,
  securityDevicesController.deleteDeviceSessionByIdHandler.bind(securityDevicesController)
);
