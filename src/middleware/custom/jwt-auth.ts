import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";

export const verifyJwtToken: RequestHandler = async (req: Request, res, next) => {
  const token = req.body.token || req.query.token || req.headers.authorization?.replace(/^Bearer\s/, "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    if (req?.user) {
      req.user = await jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY as string);
    }
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
