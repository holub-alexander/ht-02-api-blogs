import { validate } from "../middleware/custom/validate";
import express from "express";
import {
  authLoginSchema,
  confirmRegistrationSchema,
  checkEmailSchema,
  passwordRecoverySchema,
} from "../business-layer/validators/schemas/auth-schema";
import { verifyJwtToken, verifyPasswordRecoveryJwtToken, verifyRefreshJwtToken } from "../middleware/custom/jwt-auth";
import { userSchema } from "../business-layer/validators/schemas/user-schema";
import { authRateLimiter } from "../business-layer/security/rate-limiter";
import { authController } from "../data-layer/composition-root";

const authRouter = express.Router();

authRouter.post(
  "/login",
  authLoginSchema,
  validate,
  authRateLimiter(),
  authController.authLoginHandler.bind(authController)
);

authRouter.post(
  "/registration",
  userSchema,
  validate,
  authRateLimiter(),
  authController.authRegistrationHandler.bind(authController)
);

authRouter.post(
  "/registration-confirmation",
  confirmRegistrationSchema,
  validate,
  authRateLimiter(),
  authController.authConfirmRegistrationHandler.bind(authController)
);

authRouter.post(
  "/registration-email-resending",
  checkEmailSchema,
  validate,
  authRateLimiter(),
  authController.authRegistrationEmailResendingHandler.bind(authController)
);

authRouter.post("/refresh-token", verifyRefreshJwtToken, authController.authRefreshTokenHandler.bind(authController));

authRouter.post("/logout", verifyRefreshJwtToken, authController.authLogoutHandler.bind(authController));

authRouter.get("/me", verifyJwtToken, authController.authMeHandler.bind(authController));

authRouter.post(
  "/password-recovery",
  authRateLimiter(),
  checkEmailSchema,
  validate,
  authController.passwordRecoveryHandler.bind(authController)
);

authRouter.post(
  "/new-password",
  authRateLimiter(),
  passwordRecoverySchema,
  validate,
  verifyPasswordRecoveryJwtToken,
  authController.confirmPasswordRecoveryHandler.bind(authController)
);

export default authRouter;
