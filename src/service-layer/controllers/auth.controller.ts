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
import { jwtToken } from "../../business-layer/security/jwt-token";
import { APIErrorResult } from "../../@types";

export const authLoginHandler = async (
  req: Request<{}, {}, LoginInputModel>,
  res: Response<LoginSuccessViewModel | number>
) => {
  const isCorrectCredentials = await authService.checkCredentials({
    loginOrEmail: req.body.loginOrEmail,
    password: req.body.password,
  });

  if (isCorrectCredentials) {
    const token = await jwtToken({ loginOrEmail: req.body.loginOrEmail });

    return res.status(constants.HTTP_STATUS_OK).send({ accessToken: token });
  }

  return res.sendStatus(401);
};

export const authRegistrationHandler = async (req: Request<{}, {}, UserInputModel>, res: Response) => {
  const data = await authService.registrationUser(req.body);

  if (!data) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
      errorsMessages: [
        {
          message: "User with this login already exists",
          field: "login",
        },
      ],
    } as APIErrorResult);
  }

  return res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
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
