import { PostInputModel, PostViewModel } from "../@types";
import { postsData } from "../data/posts";
import { blogsRepository } from "./blogs-repository";

export const postsRepository = {
  getAllPosts: (): PostViewModel[] => postsData,

  getPostById: (postId: string): PostViewModel | null => postsData.find((post) => post.id === postId) ?? null,

  createPost: (body: PostInputModel): PostViewModel | null => {
    const foundBlog = blogsRepository.getBlogById(body.blogId);

    if (foundBlog) {
      const formattedData: PostViewModel = {
        ...body,
        id: new Date().valueOf().toString(),
        blogId: foundBlog.id,
        blogName: foundBlog.name,
      };
      postsData.push(formattedData);

      return formattedData;
    }

    return null;
  },

  deletePost: (postId: string): PostViewModel[] | null => {
    const findIndex = postsData.findIndex((post) => post.id === postId);

    if (findIndex > -1) {
      postsData.splice(findIndex, 1);
      return postsData.filter((post) => post.id !== postId);
    }

    return null;
  },

  updatePostById: (postId: string, data: PostInputModel): PostViewModel | null => {
    const foundPostIndex = postsData.findIndex((blog) => blog.id === postId);
    const foundBlog = blogsRepository.getBlogById(data.blogId);

    if (foundPostIndex > -1 && foundBlog) {
      postsData[foundPostIndex] = {
        ...postsData[foundPostIndex],
        ...data,
        blogId: foundBlog.id,
        blogName: foundBlog.name,
      };
      return postsData[foundPostIndex];
    }

    return null;
  },

  deleteAllPosts: (): PostViewModel[] => postsData.splice(0, postsData.length),
};
