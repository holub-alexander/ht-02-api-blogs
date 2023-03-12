import { PaginationAndSortQueryParams, Paginator, SortDirections } from "../../@types";
import { CommentInputModel, PostInputModel } from "../request/request-types";
import { PostViewModel } from "../response/response-types";
import { PostsQueryRepository } from "../../data-layer/repositories/posts/posts-query-repository";
import { postsMapper } from "../../business-layer/mappers/posts-mapper";
import { PostsWriteRepository } from "../../data-layer/repositories/posts/posts-write-repository";
import { CommentsWriteRepository } from "../../data-layer/repositories/comments/comments-write-repository";

import { commentMapper } from "../../business-layer/mappers/comment-mapper";
import { CommentsQueryRepository } from "../../data-layer/repositories/comments/comments-query-repository";
import { UsersQueryRepository } from "../../data-layer/repositories/users/users-query-repository";

export class PostsService {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsWriteRepository: PostsWriteRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsWriteRepository: CommentsWriteRepository,
    private usersQueryRepository: UsersQueryRepository
  ) {}

  async getAllPosts({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
  }): Promise<Paginator<PostViewModel[]>> {
    const res = await this.postsQueryRepository.getAllPosts<PostViewModel>({
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
    });

    return {
      ...res,
      items: postsMapper.mapPostsViewModel(res.items),
    };
  }

  async getAllPostsByBlogId({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    id,
  }: PaginationAndSortQueryParams & { id: string }): Promise<Paginator<PostViewModel[]>> {
    const res = await this.postsQueryRepository.getAllPostsByBlogId({
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
      id,
    });

    return {
      ...res,
      items: postsMapper.mapPostsViewModel(res.items),
    };
  }

  async getPostById(postId: string): Promise<PostViewModel | null> {
    const post = await this.postsQueryRepository.getPostById<PostViewModel>(postId);

    return post ? postsMapper.mapPostViewModel(post) : null;
  }

  async createPost(body: PostInputModel): Promise<PostViewModel | null> {
    const newPost = await this.postsWriteRepository.createPost(body);

    return newPost ? postsMapper.mapPostViewModel(newPost) : null;
  }

  async createCommentByCurrentPost(postId: string, body: CommentInputModel, loginOrEmail: string) {
    const findPost = await this.postsQueryRepository.getPostById<PostViewModel>(postId);
    const user = await this.usersQueryRepository.getUserByLoginOrEmailOnly(loginOrEmail);

    if (!findPost || !user) {
      return null;
    }

    const data = await this.commentsWriteRepository.createCommentByCurrentPost(postId, body, user);
    return data ? commentMapper.mapCommentViewModel(data) : null;
  }

  async getAllCommentsForPost({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    postId,
  }: PaginationAndSortQueryParams & { postId: string }) {
    const post = await this.postsQueryRepository.getPostById<PostViewModel>(postId);

    if (!post) {
      return null;
    }

    const data = await this.commentsQueryRepository.getAllCommentsForPost({
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
  }
}
