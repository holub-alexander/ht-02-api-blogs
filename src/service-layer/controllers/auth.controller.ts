import { Request, Response } from "express";
import {
  LoginInputModel,
  RegistrationConfirmationCodeModel,
  RegistrationEmailResending,
  UserInputModel,
} from "../request/requestTypes";
import { constants } from "http2";
import { authService } from "../services/auth.service";
import { LoginSuccessViewModel } from "../response/responseTypes";
import { APIErrorResult } from "../../@types";

export const authLoginHandler = async (
  req: Request<{}, {}, LoginInputModel>,
  res: Response<LoginSuccessViewModel | number>
) => {
  const tokens = await authService.loginUser({
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
};

export const authRegistrationHandler = async (req: Request<{}, {}, UserInputModel>, res: Response) => {
  try {
    await authService.registrationUser(req.body);

    return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  } catch (err: any) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
      errorsMessages: [err.data],
    } as APIErrorResult);
  }
};

export const authConfirmRegistrationHandler = async (
  req: Request<{}, {}, RegistrationConfirmationCodeModel>,
  res: Response
) => {
  const user = await authService.confirmRegistration(req.body);

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
};

export const authRegistrationEmailResendingHandler = async (
  req: Request<{}, {}, RegistrationEmailResending>,
  res: Response
) => {
  const isResendConfirmationCode = await authService.registrationEmailResending(req.body);

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
};

export const authMeHandler = async (req: Request, res: Response) => {
  const userMe = await authService.getInformationAboutUser(req.user.loginOrEmail);

  if (!userMe) {
    return res.sendStatus(401);
  }

  return res.status(constants.HTTP_STATUS_OK).send(userMe);
};

export const authRefreshTokenHandler = async (req: Request, res: Response) => {
  if (!req.cookies.refreshToken) {
    return res.sendStatus(401);
  }

  const newTokens = await authService.updateTokens(req.userRefreshTokenPayload);

  if (!newTokens) {
    return res.sendStatus(401);
  }

  res.cookie("refreshToken", newTokens.refreshToken, { httpOnly: true, secure: true });

  return res.status(constants.HTTP_STATUS_OK).send({ accessToken: newTokens.accessToken });
};

export const authLogoutHandler = async (req: Request, res: Response) => {
  if (!req.cookies.refreshToken) {
    return res.sendStatus(401);
  }

  const response = await authService.logout(req.userRefreshTokenPayload);

  return res.sendStatus(response ? constants.HTTP_STATUS_NO_CONTENT : 401);
};
