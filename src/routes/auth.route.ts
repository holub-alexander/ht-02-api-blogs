import { validate } from "../middleware/custom/validate";
import express from "express";
import { authLoginSchema } from "../business-layer/validators/schemas/auth-schema";
import { authLoginHandler, authMeHandler } from "../service-layer/controllers/auth.controller";
import { verifyJwtToken } from "../middleware/custom/jwt-auth";

const authRouter = express.Router();

authRouter.post("/login", authLoginSchema, validate, authLoginHandler);
authRouter.get("/me", verifyJwtToken, authMeHandler);

export default authRouter;
