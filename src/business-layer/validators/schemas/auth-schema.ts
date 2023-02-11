import { checkSchema } from "express-validator";
import { validateValueLength } from "../../../utils/common/customValidations";
import { EMAIL_REGEX } from "../../../utils/constants/regex";

const createErrorMessage = (isValidValue: boolean, errorMessage: string): void | never => {
  if (!isValidValue) {
    throw new Error(errorMessage);
  }
};

export const authLoginSchema = checkSchema(
  {
    loginOrEmail: {
      trim: true,
      custom: {
        options: (value) => {
          const isEmail = value.includes("@");

          if (isEmail) {
            createErrorMessage(validateValueLength(value, 3, 200), "The field must contain from 3 to 200 characters");
            createErrorMessage(EMAIL_REGEX.test(value), "Invalid email entered");
          } else {
            createErrorMessage(validateValueLength(value, 3, 10), "The field must contain from 3 to 10 characters");
          }

          return value;
        },
      },
    },
    password: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 6 to 20 characters",
        options: {
          min: 6,
          max: 20,
        },
      },
    },
  },
  ["body"]
);

export const confirmRegistrationSchema = checkSchema(
  {
    code: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 5 to 50 characters",
        options: {
          min: 5,
          max: 50,
        },
      },
    },
  },
  ["body"]
);

export const registrationEmailResendingSchema = checkSchema(
  {
    email: {
      trim: true,
      matches: {
        options: EMAIL_REGEX,
        errorMessage: "Invalid email entered",
      },
    },
  },
  ["body"]
);
