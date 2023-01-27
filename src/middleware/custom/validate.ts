import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { APIErrorResult, FieldError } from "../../@types";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).formatWith(
    (error: ValidationError): FieldError => ({ message: error.msg, field: error.param })
  );

  if (!errors.isEmpty()) {
    return res.status(400).json({ errorsMessages: errors.array({ onlyFirstError: true }) } as APIErrorResult);
  }

  next();
};
