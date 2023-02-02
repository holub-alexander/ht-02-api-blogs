import { Request, Response } from "express";
import { LoginInputModel } from "../request/requestTypes";
import { constants } from "http2";
import { authService } from "../services/auth.service";

import { LoginSuccessViewModel } from "../response/responseTypes";
import { jwtToken } from "../../business-layer/security/jwt-token";

export const authLoginHandler = async (
  req: Request<{}, {}, LoginInputModel>,
  res: Response<LoginSuccessViewModel | number>
) => {
  const isCorrectCredentials = await authService.checkCredentials({
    loginOrEmail: req.body.loginOrEmail,
    password: req.body.password,
  });

  if (isCorrectCredentials) {
    const token = jwtToken({ loginOrEmail: req.body.loginOrEmail });

    return res.status(constants.HTTP_STATUS_OK).send({ accessToken: token });
  }

  return res.sendStatus(401);
};

export const authMeHandler = async (req: Request, res: Response) => {
  // @ts-ignore
  const userMe = await authService.getInformationAboutUser(req.user.loginOrEmail);

  if (!userMe) {
    return res.sendStatus(401);
  }

  return res.status(constants.HTTP_STATUS_OK).send(userMe);
};
