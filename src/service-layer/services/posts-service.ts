import {
  CommentDBType,
  LikeStatuses,
  PaginationAndSortQueryParams,
  Paginator,
  ReactionDBType,
  SortDirections,
} from "../../@types";
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
import { ReactionsWriteRepository } from "../../data-layer/repositories/reactions/reactions-write-repository";
import { ReactionModel } from "../../data-layer/models/reaction-model";

export class PostsService {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsWriteRepository: PostsWriteRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsWriteRepository: CommentsWriteRepository,
    private usersQueryRepository: UsersQueryRepository,
    private reactionsQueryRepository: ReactionsQueryRepository,
    private reactionsWriteRepository: ReactionsWriteRepository
  ) {}

  async getAllPosts({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    userLogin = "",
  }): Promise<Paginator<PostViewModel[]>> {
    const res = await this.postsQueryRepository.getAllPosts({
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
    });

    if (userLogin) {
      const user = await this.usersQueryRepository.getUserByLogin(userLogin);
      const reactions = await this.reactionsQueryRepository.getReactionPostsByIds(
        res.items.map((post) => post._id),
        user!._id
      );

      return {
        ...res,
        items: await PostsMapper.mapPostsViewModel(
          res.items,
          reactions,
          this.reactionsQueryRepository.getLatestReactionsForPost,
          user!._id
        ),
      };
    }

    return {
      ...res,
      items: await PostsMapper.mapPostsViewModel(
        res.items,
        null,
        this.reactionsQueryRepository.getLatestReactionsForPost,
        null
      ),
    };
  }

  async getAllPostsByBlogId({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    id,
    userLogin = "",
  }: PaginationAndSortQueryParams & { id: string; userLogin: string }): Promise<Paginator<PostViewModel[]>> {
    const res = await this.postsQueryRepository.getAllPostsByBlogId({
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
      id,
    });

    if (userLogin) {
      const user = await this.usersQueryRepository.getUserByLogin(userLogin);
      const reactions = await this.reactionsQueryRepository.getReactionPostsByIds(
        res.items.map((post) => post._id),
        user!._id
      );

      return {
        ...res,
        items: await PostsMapper.mapPostsViewModel(
          res.items,
          reactions,
          this.reactionsQueryRepository.getLatestReactionsForPost,
          user!._id
        ),
      };
    }

    return {
      ...res,
      items: await PostsMapper.mapPostsViewModel(
        res.items,
        null,
        this.reactionsQueryRepository.getLatestReactionsForPost,
        null
      ),
    };
  }

  async getPostById(postId: string, userLogin = ""): Promise<PostViewModel | null> {
    const post = await this.postsQueryRepository.getPostById(postId);

    if (!post) {
      return null;
    }

    if (userLogin) {
      const user = await this.usersQueryRepository.getUserByLogin(userLogin);
      const reaction = await this.reactionsQueryRepository.getReactionByPostId(post._id, user!._id);

      return await PostsMapper.mapPostViewModel(
        post,
        reaction,
        this.reactionsQueryRepository.getLatestReactionsForPost,
        user!._id
      );
    }

    return post
      ? await PostsMapper.mapPostViewModel(post, null, this.reactionsQueryRepository.getLatestReactionsForPost, null)
      : null;
  }

  async createPost(body: PostInputModel): Promise<PostViewModel | null> {
    const newPost = await this.postsWriteRepository.createPost(body);

    return newPost
      ? await PostsMapper.mapPostViewModel(newPost, null, this.reactionsQueryRepository.getLatestReactionsForPost, null)
      : null;
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

  async incrementDecrementLikeCounter(
    postId: ObjectId,
    userReactionType: LikeStatuses | null,
    likeStatus: LikeStatuses
  ) {
    if (likeStatus === LikeStatuses.NONE && userReactionType !== LikeStatuses.NONE) {
      if (userReactionType === LikeStatuses.LIKE) {
        return this.postsWriteRepository.likePostById(postId, false);
      }

      return this.postsWriteRepository.dislikePostById(postId, false);
    }

    if (userReactionType === likeStatus) {
      return;
    }

    if (likeStatus === LikeStatuses.LIKE && userReactionType === LikeStatuses.DISLIKE) {
      await this.postsWriteRepository.dislikePostById(postId, false);
      return this.postsWriteRepository.likePostById(postId, true);
    }

    if (likeStatus === LikeStatuses.DISLIKE && userReactionType === LikeStatuses.LIKE) {
      await this.postsWriteRepository.likePostById(postId, false);
      return this.postsWriteRepository.dislikePostById(postId, true);
    }

    if (likeStatus === LikeStatuses.LIKE) {
      return this.postsWriteRepository.likePostById(postId, true);
    }

    if (likeStatus === LikeStatuses.DISLIKE) {
      return this.postsWriteRepository.dislikePostById(postId, true);
    }
  }

  async setLikeUnlikeForPost(postId: string, login: string, likeStatus: LikeStatuses): Promise<ReactionDBType | null> {
    const post = await this.postsQueryRepository.getPostById(postId);
    const user = await this.usersQueryRepository.getUserByLogin(login);

    if (!post || !user) {
      return null;
    }

    const reaction = await this.reactionsQueryRepository.getReactionByPostId(post._id, user._id);

    if (!reaction && likeStatus === LikeStatuses.NONE) {
      return null;
    }

    if (reaction) {
      await this.incrementDecrementLikeCounter(post._id, reaction.likeStatus, likeStatus);
      const res = await this.reactionsWriteRepository.updateLikeStatus(reaction._id, likeStatus);

      if (res) {
        return reaction;
      }

      return null;
    }

    const reactionDTO = new ReactionModel({
      _id: new ObjectId(),
      commentId: null,
      postId: post._id,
      user: {
        id: user._id,
        login: user.accountData.login,
      },
      createdAt: new Date(),
      likeStatus,
    });

    await this.incrementDecrementLikeCounter(post._id, null, likeStatus);
    await this.reactionsWriteRepository.createReaction(reactionDTO);

    return reactionDTO;
  }
}
