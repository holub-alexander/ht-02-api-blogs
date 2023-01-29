import { validate } from "../middleware/custom/validate";
import express from "express";
import { authLoginSchema } from "../business-layer/validators/schemas/auth-schema";
import { authLoginHandler } from "../service-layer/controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/login", authLoginSchema, validate, authLoginHandler);

export default authRouter;
