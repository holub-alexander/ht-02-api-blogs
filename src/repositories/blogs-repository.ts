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

  deleteBlog: (blogId: string): BlogViewModel[] | null => {
    const findIndex = blogsData.findIndex((blog) => blog.id === blogId);

    if (findIndex > -1) {
      return blogsData.filter((blog) => blog.id !== blogId);
    }

    return null;
  },

  updateBlogById: (blogId: string, data: BlogInputModel): BlogViewModel | null => {
    const findIndex = blogsData.findIndex((blog) => blog.id === blogId);

    if (findIndex > -1) {
      blogsData[findIndex] = { ...blogsData[findIndex], ...data };
      return blogsData[findIndex];
    }

    return null;
  },
};
