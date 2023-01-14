import { checkSchema } from "express-validator";

export const postSchema = checkSchema(
  {
    title: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 1 to 30 characters",
        options: {
          min: 1,
          max: 30,
        },
      },
    },
    shortDescription: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 1 to 100 characters",
        options: {
          min: 1,
          max: 100,
        },
      },
    },
    content: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 1 to 1000 characters",
        options: {
          min: 1,
          max: 1000,
        },
      },
    },
    blogId: {
      trim: true,
      isLength: {
        errorMessage: "The field must contain from 1 to 30 characters",
        options: {
          min: 1,
          max: 30,
        },
      },
    },
  },
  ["body"]
);
