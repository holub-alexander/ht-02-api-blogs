import { checkSchema } from "express-validator";
import { WEBSITE_URL } from "../../../utils/constants/regex";
import { paginationQueryParamsSchema } from "./query-params/pagination-schema";
import { sortQueryParamsSchema } from "./query-params/sort-schema";

export const blogsQuerySchema = [
  paginationQueryParamsSchema,
  sortQueryParamsSchema,
  checkSchema(
    {
      searchNameTerm: {
        optional: true,
        trim: true,
        isLength: {
          errorMessage: "The searchNameTerm parameter must be between 1 and 15 characters",
          options: {
            min: 1,
            max: 15,
          },
        },
      },
    },
    ["query"]
  ),
];

export const blogSchema = checkSchema(
  {
    name: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 1 to 15 characters",
        options: {
          min: 1,
          max: 15,
        },
      },
    },
    description: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 1 to 500 characters",
        options: {
          min: 1,
          max: 500,
        },
      },
    },
    websiteUrl: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 1 to 100 characters",
        options: {
          min: 1,
          max: 100,
        },
      },
      matches: {
        options: WEBSITE_URL,
        errorMessage: "Invalid url entered",
      },
    },
  },
  ["body"]
);
