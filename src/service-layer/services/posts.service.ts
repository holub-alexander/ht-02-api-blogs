import { PaginationAndSortQueryParams, Paginator, SortDirections } from "../../@types";
import { CommentInputModel, PostInputModel } from "../request/requestTypes";
import { PostViewModel } from "../response/responseTypes";
import { postsQueryRepository } from "../../data-layer/repositories/posts/posts.query.repository";
import { postsMapper } from "../../business-layer/mappers/posts.mapper";
import { postsWriteRepository } from "../../data-layer/repositories/posts/posts.write.repository";
import { commentsWriteRepository } from "../../data-layer/repositories/comments/comments.write.repository";
import { usersQueryRepository } from "../../data-layer/repositories/users/users.query.repository";
import { commentMapper } from "../../business-layer/mappers/comment.mapper";
import { commentsQueryRepository } from "../../data-layer/repositories/comments/comments.query.repository";

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

  createCommentByCurrentPost: async (postId: string, body: CommentInputModel, loginOrEmail: string) => {
    const findPost = await postsQueryRepository.getPostById<PostViewModel>(postId);
    const user = await usersQueryRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!findPost || !user) {
      return null;
    }

    const data = await commentsWriteRepository.createCommentByCurrentPost(postId, body, user);
    return data ? commentMapper.mapCommentViewModel(data) : null;
  },

  getAllCommentsForPost: async ({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    postId,
  }: PaginationAndSortQueryParams & { postId: string }) => {
    const post = await postsQueryRepository.getPostById<PostViewModel>(postId);

    if (!post) {
      return null;
    }

    const data = await commentsQueryRepository.getAllCommentsForPost({
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
      postId,
    });

    return {
      ...data,
      items: commentMapper.mapCommentsViewModel(data.items),
    };
  },
};
