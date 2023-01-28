import { PaginationAndSortQueryParams, Paginator, SortDirections } from "../../@types";
import { postsCollection } from "../../data-layer/adapters/mongoDB";
import { ObjectId, WithId } from "mongodb";
import { blogsService } from "./blogs.service";
import { getObjectToSort } from "../../utils/common/getObjectToSort";
import { PostInputModel } from "../request/requestTypes";
import { PostViewModel } from "../response/responseTypes";
import { postsQueryRepository } from "../../data-layer/repositories/posts/posts.query.repository";
import { postsMapper } from "../../business-layer/mappers/posts.mapper";
import { postsWriteRepository } from "../../data-layer/repositories/posts/posts.write.repository";

export const postsService = {
  getAllPosts: async ({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
  }): Promise<Paginator<PostViewModel[]>> => {
    const res = await postsQueryRepository.getAllPosts<PostViewModel>({ pageSize, pageNumber, sortBy, sortDirection });

    return {
      ...res,
      items: postsMapper.mapPostsViewModel(res.items),
    };
  },

  getAllPostsByBlogId: async ({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    id,
  }: PaginationAndSortQueryParams & { id: string }): Promise<Paginator<PostViewModel[]>> => {
    const res = await postsQueryRepository.getAllPostsByBlogId({ pageSize, pageNumber, sortBy, sortDirection, id });

    return {
      ...res,
      items: postsMapper.mapPostsViewModel(res.items),
    };
  },

  getPostById: async (postId: string): Promise<PostViewModel | null> => {
    const post = await postsQueryRepository.getPostById<PostViewModel>(postId);

    return post ? postsMapper.mapPostViewModel(post) : null;
  },

  createPost: async (body: PostInputModel): Promise<PostViewModel | null> => {
    const newPost = await postsWriteRepository.createPost(body);

    return newPost ? postsMapper.mapPostViewModel(newPost) : null;
  },
};
