import { checkSchema } from "express-validator";
import { SortDirections } from "../../../@types";

export const sortQueryParamsSchema = checkSchema(
  {
    sortBy: {
      trim: true,
      isLength: {
        errorMessage: "The sortBy parameter must be between 1 and 50 characters",
        options: {
          min: 1,
          max: 50,
        },
      },
    },
    sortDirection: {
      optional: true,
      trim: true,
      custom: {
        options: (value: SortDirections) => {
          const sortTypes: SortDirections[] = [SortDirections.ASC, SortDirections.DESC];

          if (!sortTypes.includes(value)) {
            throw new Error("This type of sorting is not available");
          }

          return true;
        },
      },
    },
  },
  ["query"]
);
