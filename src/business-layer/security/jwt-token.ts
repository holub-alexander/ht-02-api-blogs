import jwt from "jsonwebtoken";

export const jwtToken = async (payload: Object, secretKey: string, expiresIn = "24h") =>
  jwt.sign(payload, secretKey, {
    expiresIn,
  });
