import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";
import { User, UserRefreshTokenPayload } from "../../@types";
import { securityQueryRepository } from "../../data-layer/repositories/security/security-query.repository";

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
