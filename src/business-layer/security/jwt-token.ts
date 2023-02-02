import jwt from "jsonwebtoken";

export const jwtToken = (payload: Object, expiresIn = "24h") =>
  jwt.sign(payload, process.env.JWT_TOKEN_SECRET_KEY as string, {
    expiresIn,
  });
