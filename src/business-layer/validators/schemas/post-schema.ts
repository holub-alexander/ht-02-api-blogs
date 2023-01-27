import { checkSchema } from "express-validator";
import { blogsService } from "../../../services/blogs.service";
import { paginationQueryParamsSchema } from "./query-params/pagination-schema";
import { sortQueryParamsSchema } from "./query-params/sort-schema";

export const postsQuerySchema = [paginationQueryParamsSchema, sortQueryParamsSchema];

export const blogPostSchema = checkSchema({
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
});

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
      custom: {
        options: async (value) => {
          const findBlog = await blogsService.getBlogById(value);

          if (!findBlog) {
            return Promise.reject("Blog with specified id was not found");
          }
        },
      },
    },
  },
  ["body"]
);
