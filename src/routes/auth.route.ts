import { validate } from "../middleware/custom/validate";
import express from "express";
import {
  authLoginSchema,
  confirmRegistrationSchema,
  checkEmailSchema,
  passwordRecoverySchema,
} from "../business-layer/validators/schemas/auth-schema";
import {
  authConfirmRegistrationHandler,
  authLoginHandler,
  authLogoutHandler,
  authMeHandler,
  authRefreshTokenHandler,
  authRegistrationEmailResendingHandler,
  authRegistrationHandler,
  confirmPasswordRecoveryHandler,
  passwordRecoveryHandler,
} from "../service-layer/controllers/auth.controller";
import { verifyJwtToken, verifyPasswordRecoveryJwtToken, verifyRefreshJwtToken } from "../middleware/custom/jwt-auth";
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
  checkEmailSchema,
  validate,
  authRateLimiter(),
  authRegistrationEmailResendingHandler
);
authRouter.post("/refresh-token", verifyRefreshJwtToken, authRefreshTokenHandler);
authRouter.post("/logout", verifyRefreshJwtToken, authLogoutHandler);
authRouter.get("/me", verifyJwtToken, authMeHandler);
authRouter.post("/password-recovery", authRateLimiter(), checkEmailSchema, validate, passwordRecoveryHandler);
authRouter.post(
  "/new-password",
  authRateLimiter(),
  passwordRecoverySchema,
  validate,
  verifyPasswordRecoveryJwtToken,
  confirmPasswordRecoveryHandler
);

export default authRouter;
