import { blogsData } from "../data/blogs";
import { BlogInputModel, BlogViewModel } from "../@types";

export const blogsRepository = {
  getAllBlogs: (): BlogViewModel[] => blogsData,

  getBlogById: (blogId: string): BlogViewModel | null => blogsData.find((blog) => blog.id === blogId) ?? null,

  createBlog: (body: BlogInputModel): BlogViewModel => {
    const formattedData: BlogViewModel = {
      ...body,
      id: new Date().valueOf().toString(),
    };

    blogsData.push(formattedData);

    return formattedData;
  },
};
