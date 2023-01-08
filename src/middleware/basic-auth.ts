import { RequestHandler } from "express";
import { config } from "../config";

export const basicAuth: RequestHandler = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const authorizationHeaderValue = authorizationHeader.replace("Basic ", "");
    const decodeValue = Buffer.from(authorizationHeaderValue, "base64").toString("ascii");

    if (decodeValue === `${config.login}:${config.password}`) {
      return next();
    }
  }

  return res.sendStatus(401);
};
