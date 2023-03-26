import { NewestLike, PostViewModel } from "../../service-layer/response/response-types";
import { LikeStatuses, PostDBType, ReactionDBType } from "../../@types";
import { HydratedDocument } from "mongoose";
import { ObjectId } from "mongodb";

export class PostsMapper {
  private static getResult(
    post: PostDBType,
    reaction: ReactionDBType | null,
    lastReactions: ReactionDBType[]
  ): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blog.id.toString(),
      blogName: post.blog.name,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.likesInfo.likesCount,
        dislikesCount: post.likesInfo.dislikesCount,
        myStatus: reaction ? reaction.likeStatus : LikeStatuses.NONE,
        newestLikes:
          lastReactions.length > 0
            ? lastReactions.map(
                (reaction): NewestLike => ({
                  addedAt: reaction.createdAt,
                  userId: reaction.user.id.toString(),
                  login: reaction.user.login,
                })
              )
            : [],
      },
    };
  }

  public static async mapPostsViewModel(
    posts: PostDBType[],
    reactions: ReactionDBType[] | null,
    getLatestReactionsForPost: (postId: ObjectId, limit: number) => Promise<HydratedDocument<ReactionDBType>[]>
  ): Promise<PostViewModel[]> {
    const arr = posts.map(async (post) => {
      const lastReactions: HydratedDocument<ReactionDBType>[] = await getLatestReactionsForPost(post._id, 3);

      if (!reactions || !lastReactions) {
        return this.getResult(post, null, lastReactions);
      }

      const foundReactionIndex = reactions.findIndex((reaction) => reaction.postId!.toString() === post._id.toString());

      if (foundReactionIndex > -1) {
        return this.getResult(post, reactions[foundReactionIndex], lastReactions);
      }

      return this.getResult(post, null, lastReactions);
    });

    return Promise.all(arr);
  }

  public static async mapPostViewModel(
    post: PostDBType,
    reaction: ReactionDBType | null,
    getLatestReactionsForPost: (postId: ObjectId, limit: number) => Promise<HydratedDocument<ReactionDBType>[]>
  ): Promise<PostViewModel> {
    const lastReactions: HydratedDocument<ReactionDBType>[] = await getLatestReactionsForPost(post._id, 3);

    return this.getResult(post, reaction, lastReactions);
  }
}
