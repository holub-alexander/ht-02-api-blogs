import { validate } from "../middleware/custom/validate";
import express from "express";
import {
  authLoginSchema,
  confirmRegistrationSchema,
  registrationEmailResendingSchema,
} from "../business-layer/validators/schemas/auth-schema";
import {
  authConfirmRegistrationHandler,
  authLoginHandler,
  authLogoutHandler,
  authMeHandler,
  authRefreshTokenHandler,
  authRegistrationEmailResendingHandler,
  authRegistrationHandler,
} from "../service-layer/controllers/auth.controller";
import { verifyJwtToken, verifyRefreshJwtToken } from "../middleware/custom/jwt-auth";
import { userSchema } from "../business-layer/validators/schemas/user-schema";
import { authRateLimiter } from "../business-layer/security/rate-limiter";

const authRouter = express.Router();

authRouter.post("/login", authLoginSchema, validate, authRateLimiter(), authLoginHandler);
authRouter.post("/registration", userSchema, validate, authRateLimiter(), authRegistrationHandler);
authRouter.post(
  "/registration-confirmation",
  confirmRegistrationSchema,
  validate,
  authRateLimiter(),
  authConfirmRegistrationHandler
);
authRouter.post(
  "/registration-email-resending",
  registrationEmailResendingSchema,
  validate,
  authRateLimiter(),
  authRegistrationEmailResendingHandler
);
authRouter.post("/refresh-token", verifyRefreshJwtToken, authRefreshTokenHandler);
authRouter.post("/logout", verifyRefreshJwtToken, authLogoutHandler);
authRouter.get("/me", verifyJwtToken, authMeHandler);

export default authRouter;
