import { CommentDBType, LikeStatuses, PaginationAndSortQueryParams, Paginator, SortDirections } from "../../@types";
import { CommentInputModel, PostInputModel } from "../request/request-types";
import { CommentViewModel, PostViewModel } from "../response/response-types";
import { PostsQueryRepository } from "../../data-layer/repositories/posts/posts-query-repository";
import { PostsMapper } from "../../business-layer/mappers/posts-mapper";
import { PostsWriteRepository } from "../../data-layer/repositories/posts/posts-write-repository";
import { CommentsWriteRepository } from "../../data-layer/repositories/comments/comments-write-repository";
import { CommentMapper } from "../../business-layer/mappers/comment-mapper";
import { CommentsQueryRepository } from "../../data-layer/repositories/comments/comments-query-repository";
import { UsersQueryRepository } from "../../data-layer/repositories/users/users-query-repository";
import { ObjectId } from "mongodb";
import { CommentModel } from "../../data-layer/models/comment-model";
import { ReactionsQueryRepository } from "../../data-layer/repositories/reactions/reactions-query-repository";

export class PostsService {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsWriteRepository: PostsWriteRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsWriteRepository: CommentsWriteRepository,
    private usersQueryRepository: UsersQueryRepository,
    private reactionsQueryRepository: ReactionsQueryRepository
  ) {}

  async getAllPosts({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
  }): Promise<Paginator<PostViewModel[]>> {
    const res = await this.postsQueryRepository.getAllPosts({
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
    });

    return {
      ...res,
      items: PostsMapper.mapPostsViewModel(res.items),
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
      items: PostsMapper.mapPostsViewModel(res.items),
    };
  }

  async getPostById(postId: string): Promise<PostViewModel | null> {
    const post = await this.postsQueryRepository.getPostById(postId);

    return post ? PostsMapper.mapPostViewModel(post) : null;
  }

  async createPost(body: PostInputModel): Promise<PostViewModel | null> {
    const newPost = await this.postsWriteRepository.createPost(body);

    return newPost ? PostsMapper.mapPostViewModel(newPost) : null;
  }

  async createCommentByCurrentPost(
    postId: string,
    body: CommentInputModel,
    login: string
  ): Promise<CommentViewModel | null> {
    const findPost = await this.postsQueryRepository.getPostById(postId);
    const user = await this.usersQueryRepository.getUserByLogin(login);

    if (!findPost || !user) {
      return null;
    }

    const newCommentDTO = new CommentModel<CommentDBType>({
      _id: new ObjectId(),
      content: body.content,
      commentatorInfo: { id: user._id, login },
      createdAt: new Date().toISOString(),
      postId: findPost._id,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    });

    const data = await this.commentsWriteRepository.createCommentByCurrentPost(postId, newCommentDTO);

    return data ? CommentMapper.mapCommentViewModel(data, null) : null;
  }

  async getAllCommentsForPost({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    postId,
    userLogin = null,
  }: PaginationAndSortQueryParams & { postId: string; userLogin: string | null }) {
    const post = await this.postsQueryRepository.getPostById(postId);

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

    if (userLogin) {
      const user = await this.usersQueryRepository.getUserByLogin(userLogin);
      const reactions = await this.reactionsQueryRepository.getReactionCommentsByIds(
        data.items.map((comment) => comment._id),
        user!._id
      );

      return {
        ...data,
        items: CommentMapper.mapCommentsViewModel(data.items, reactions),
      };
    }

    return {
      ...data,
      items: CommentMapper.mapCommentsViewModel(data.items, null),
    };
  }
}
