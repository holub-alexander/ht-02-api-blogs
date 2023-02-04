import { checkSchema } from "express-validator";

export const commentCreateSchema = checkSchema({
  content: {
    trim: true,
    isLength: {
      errorMessage: "The field must contain from 20 to 300 characters",
      options: {
        min: 20,
        max: 300,
      },
    },
  },
});
