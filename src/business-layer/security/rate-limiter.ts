import rateLimit from "express-rate-limit";

export const authRateLimiter = (seconds = 10) =>
  rateLimit({
    windowMs: seconds * 1000, // 10 seconds
    max: 5,
    message: "Too many accounts created from this IP, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
  });
