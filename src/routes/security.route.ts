import express from "express";
import { verifyRefreshJwtToken } from "../middleware/custom/jwt-auth";
import {
  deleteAllDevicesWithActiveSessionsHandler,
  deleteDeviceSessionByIdHandler,
  getAllDevicesWithActiveSessionsForUserHandler,
} from "../service-layer/controllers/security.controller";

export const securityRouter = express.Router();

securityRouter.get("/devices", verifyRefreshJwtToken, getAllDevicesWithActiveSessionsForUserHandler);
securityRouter.delete("/devices", verifyRefreshJwtToken, deleteAllDevicesWithActiveSessionsHandler);
securityRouter.delete("/devices/:deviceId", verifyRefreshJwtToken, deleteDeviceSessionByIdHandler);
