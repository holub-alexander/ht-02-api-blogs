import { paginationQueryParamsSchema } from "./query-params/pagination-schema";
import { sortQueryParamsSchema } from "./query-params/sort-schema";
import { checkSchema } from "express-validator";
import { EMAIL_REGEX, LOGIN_REGEX } from "../../../utils/constants/regex";

export const userQuerySchema = [
  paginationQueryParamsSchema,
  sortQueryParamsSchema,
  checkSchema(
    {
      searchLoginTerm: {
        optional: true,
        trim: true,
        isLength: {
          errorMessage: "The searchLoginTerm parameter must be between 3 and 10 characters",
          options: {
            min: 3,
            max: 10,
          },
        },
        matches: {
          options: LOGIN_REGEX,
          errorMessage: "Invalid login entered",
        },
      },
      searchEmailTerm: {
        optional: true,
        trim: true,
        isLength: {
          errorMessage: "The searchEmailTerm parameter must be between 3 and 160 characters",
          options: {
            min: 3,
            max: 200,
          },
        },
      },
    },
    ["query"]
  ),
];

export const userSchema = checkSchema(
  {
    login: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 3 to 10 characters",
        options: {
          min: 3,
          max: 10,
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
    email: {
      trim: true,
      /*isLength: {
        errorMessage: "The field must contain from 3 to 200 characters",
        options: {
          min: 3,
          max: 200,
        },
      },*/
      matches: {
        options: EMAIL_REGEX,
        errorMessage: "Invalid email entered",
      },
    },
  },
  ["body"]
);
