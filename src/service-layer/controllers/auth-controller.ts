import { Request, Response } from "express";
import {
  LoginInputModel,
  NewPasswordRecoveryInputModel,
  PasswordRecoveryInputModel,
  RegistrationConfirmationCodeModel,
  RegistrationEmailResending,
  UserInputModel,
} from "../request/request-types";
import { constants } from "http2";

import { LoginSuccessViewModel } from "../response/response-types";
import { APIErrorResult } from "../../@types";
import { AuthService } from "../services/auth-service";

export class AuthController {
  constructor(private authService: AuthService) {}

  async authLoginHandler(req: Request<{}, {}, LoginInputModel>, res: Response<LoginSuccessViewModel | number>) {
    const tokens = await this.authService.loginUser({
      loginOrEmail: req.body.loginOrEmail,
      password: req.body.password,
      ip: req.ip || req.ips[0],
      userAgent: req.get("user-agent"),
    });

    if (!tokens) {
      return res.sendStatus(401);
    }

    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true, secure: true });
    return res.status(constants.HTTP_STATUS_OK).send({ accessToken: tokens.accessToken });
  }

  async authRegistrationHandler(req: Request<{}, {}, UserInputModel>, res: Response) {
    try {
      await this.authService.registrationUser(req.body);

      return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    } catch (err: any) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        errorsMessages: [err.data],
      } as APIErrorResult);
    }
  }

  async authConfirmRegistrationHandler(req: Request<{}, {}, RegistrationConfirmationCodeModel>, res: Response) {
    const user = await this.authService.confirmRegistration(req.body);

    if (!user) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        errorsMessages: [
          {
            message: "Confirmation code is incorrect, expired or already been applied",
            field: "code",
          },
        ],
      } as APIErrorResult);
    }

    return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  async authRegistrationEmailResendingHandler(req: Request<{}, {}, RegistrationEmailResending>, res: Response) {
    const isResendConfirmationCode = await this.authService.registrationEmailResending(req.body);

    if (!isResendConfirmationCode) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        errorsMessages: [
          {
            message: "Email already verified or no email",
            field: "email",
          },
        ],
      } as APIErrorResult);
    }

    return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  async authMeHandler(req: Request, res: Response) {
    const userMe = await this.authService.getInformationAboutUser(req.user.loginOrEmail);

    if (!userMe) {
      return res.sendStatus(401);
    }

    return res.status(constants.HTTP_STATUS_OK).send(userMe);
  }

  async authRefreshTokenHandler(req: Request, res: Response) {
    if (!req.cookies.refreshToken) {
      return res.sendStatus(401);
    }

    const newTokens = await this.authService.updateTokens(req.userRefreshTokenPayload);

    if (!newTokens) {
      return res.sendStatus(401);
    }

    res.cookie("refreshToken", newTokens.refreshToken, { httpOnly: true, secure: true });

    return res.status(constants.HTTP_STATUS_OK).send({ accessToken: newTokens.accessToken });
  }

  async authLogoutHandler(req: Request, res: Response) {
    if (!req.cookies.refreshToken) {
      return res.sendStatus(401);
    }

    const response = await this.authService.logout(req.userRefreshTokenPayload);

    return res.sendStatus(response ? constants.HTTP_STATUS_NO_CONTENT : 401);
  }

  async passwordRecoveryHandler(req: Request<{}, PasswordRecoveryInputModel>, res: Response) {
    await this.authService.passwordRecovery(req.body.email);

    return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  async confirmPasswordRecoveryHandler(req: Request<{}, NewPasswordRecoveryInputModel>, res: Response) {
    const isUpdatedPassword = await this.authService.confirmPasswordRecovery({
      newPassword: req.body.newPassword,
      recoveryCode: req.body.recoveryCode,
    });

    return res.sendStatus(isUpdatedPassword ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
  }
}
