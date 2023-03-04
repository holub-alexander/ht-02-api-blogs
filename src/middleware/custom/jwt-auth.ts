import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";
import { APIErrorResult, PasswordRecoveryPayload, User, UserRefreshTokenPayload } from "../../@types";
import { securityQueryRepository } from "../../data-layer/repositories/security/security-query.repository";
import { NewPasswordRecoveryInputModel } from "../../service-layer/request/requestTypes";

export const verifyJwtToken: RequestHandler = async (req: Request, res, next) => {
  const token = req.body.token || req.query.token || req.headers.authorization?.replace(/^Bearer\s/, "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    req.user = (await jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY as string)) as User;

    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};

export const verifyRefreshJwtToken: RequestHandler = async (req, res, next) => {
  const tokenFromCookie = req.cookies.refreshToken;

  if (!tokenFromCookie) {
    return res.sendStatus(401);
  }

  try {
    const refreshTokenPayload = (await jwt.verify(
      tokenFromCookie,
      process.env.REFRESH_TOKEN_PRIVATE_KEY as string
    )) as UserRefreshTokenPayload;

    const findUser = await securityQueryRepository.getUserByDeviceId(refreshTokenPayload.deviceId);

    if (!findUser) {
      throw new Error("User not found");
    }

    req.userRefreshTokenPayload = refreshTokenPayload;

    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};

export const verifyPasswordRecoveryJwtToken: RequestHandler = async (req, res, next) => {
  const passwordRecoveryToken = req.body.recoveryCode;

  const error: APIErrorResult = {
    errorsMessages: [{ field: "recoveryCode", message: "recoveryCode is incorrect or expired" }],
  };

  if (!passwordRecoveryToken) {
    return res.status(400).send(error);
  }

  try {
    await jwt.verify(passwordRecoveryToken, process.env.PASSWORD_RECOVERY_PRIVATE_KEY as string);

    next();
  } catch (err) {
    return res.status(400).send(error);
  }
};
