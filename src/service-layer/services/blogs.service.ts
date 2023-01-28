import { Paginator, SortDirections } from "../../@types";
import { BlogsQueryParams } from "../controllers/blogs.controller";
import { BlogViewModel } from "../response/responseTypes";
import { blogsQueryRepository } from "../../data-layer/repositories/blogs/blogs.query.repository";
import { blogsMapper } from "../../business-layer/mappers/blogs.mapper";
import { BlogInputModel } from "../request/requestTypes";
import { blogsWriteRepository } from "../../data-layer/repositories/blogs/blogs.write.repository";
import { body } from "express-validator";

export const blogsService = {
  getAllBlogs: async ({
    sortBy = "createdAt",
    sortDirection = SortDirections.DESC,
    searchNameTerm = "",
    pageSize = 10,
    pageNumber = 1,
  }: BlogsQueryParams): Promise<Paginator<BlogViewModel[]>> => {
    const res = await blogsQueryRepository.getAllBlogs<BlogViewModel>({
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchNameTerm,
    });

    return {
      ...res,
      items: blogsMapper.mapBlogsViewModel(res.items),
    };
  },

  getBlogById: async (blogId: string): Promise<BlogViewModel | null> => {
    const blog = await blogsQueryRepository.getBlogById<BlogViewModel>(blogId);

    return blog ? blogsMapper.mapBlogViewModel(blog) : null;
  },

  createBlog: async (body: BlogInputModel): Promise<BlogViewModel | null> => {
    const newBlog = await blogsWriteRepository.createBlog(body);

    return newBlog ? blogsMapper.mapBlogViewModel(newBlog) : null;
  },
};
