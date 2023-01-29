import { Request, Response } from "express";
import { LoginInputModel } from "../request/requestTypes";
import { constants } from "http2";
import { authService } from "../services/auth.service";

export const authLoginHandler = async (req: Request<{}, {}, LoginInputModel>, res: Response) => {
  const isCorrectCredentials = await authService.checkCredentials({
    loginOrEmail: req.body.loginOrEmail,
    password: req.body.password,
  });

  res.sendStatus(isCorrectCredentials ? constants.HTTP_STATUS_NO_CONTENT : 401);
};
