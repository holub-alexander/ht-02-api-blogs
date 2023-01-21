import { checkSchema } from "express-validator";

export const paginationQueryParamsSchema = checkSchema(
  {
    pageNumber: {
      optional: true,
      trim: true,
      isNumeric: {
        errorMessage: "Parameter must be a numeric value",
        options: {
          no_symbols: true,
        },
      },
      isInt: {
        errorMessage: "Page number must be between 1 and 1e6",
        options: {
          min: 1,
          max: 1e6,
        },
      },
    },
    pageSize: {
      optional: true,
      trim: true,
      isNumeric: {
        errorMessage: "Parameter must be a numeric value",
        options: {
          no_symbols: true,
        },
      },
      isInt: {
        errorMessage: "Page size must be between 1 and 1e6",
        options: {
          min: 1,
          max: 1e6,
        },
      },
    },
  },
  ["query"]
);
