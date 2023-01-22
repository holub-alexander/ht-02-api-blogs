import { PaginationAndSortQueryParams, Paginator, PostInputModel, PostViewModel, SortDirections } from "../@types";
import { postsCollection } from "../utils/common/connectDB";
import { ObjectId, WithId } from "mongodb";
import { blogsService } from "./blogs.service";
import { getObjectToSort } from "../utils/common/getObjectToSort";

export const postsService = {
  getAllPosts: async ({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
  }): Promise<Paginator<PostViewModel[]>> => {
    const sorting = getObjectToSort({ sortBy, sortDirection });
    const pageSizeValue = pageSize < 1 ? 1 : pageSize;

    const totalCount = await postsCollection.find({}).count();
    const res = await postsCollection
      .find<WithId<PostViewModel>>({})
      .skip((+pageNumber - 1) * +pageSizeValue)
      .limit(+pageSizeValue)
      .sort(sorting)
      .toArray();

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: res.map((post) => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      })) as PostViewModel[],
    };
  },

  getAllPostsByBlogId: async ({
    pageSize = 10,
    pageNumber = 1,
    sortDirection = SortDirections.DESC,
    sortBy = "",
    id,
  }: PaginationAndSortQueryParams & { id: string }): Promise<Paginator<PostViewModel[]>> => {
    const sorting = getObjectToSort({ sortBy, sortDirection });
    const pageSizeValue = pageSize < 1 ? 1 : pageSize;

    const totalCount = await postsCollection.find({ blogId: id }).count();
    const res = await postsCollection
      .find<WithId<PostViewModel>>({ blogId: id })
      .skip((+pageNumber - 1) * +pageSizeValue)
      .limit(+pageSizeValue)
      .sort(sorting)
      .toArray();

    console.log(res);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: res.map((post) => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
      })),
    };
  },

  getPostById: async (postId: string): Promise<PostViewModel | null> => {
    const isValidId = ObjectId.isValid(postId);

    if (isValidId) {
      const data = await postsCollection.findOne<PostViewModel & { _id: string }>({ _id: new ObjectId(postId) });

      if (data) {
        data.id = data._id.toString();
        /* @ts-ignore */
        delete data?._id;

        return data;
      }
    }

    return null;
  },

  createPost: async (body: PostInputModel): Promise<PostViewModel | null> => {
    const findBlog = await blogsService.getBlogById(body.blogId);

    if (findBlog) {
      const data = await postsCollection.insertOne({
        ...body,
        blogName: findBlog.name,
        createdAt: new Date().toISOString(),
      });

      if (data.acknowledged) {
        return postsService.getPostById(data.insertedId.toString());
      }
    }

    return null;
  },

  deletePost: async (postId: string): Promise<boolean> => {
    const isValidId = ObjectId.isValid(postId);

    if (isValidId) {
      const res = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
      return res.deletedCount > 0;
    }

    return false;
  },

  updatePostById: async (postId: string, data: PostInputModel): Promise<boolean> => {
    const isValidId = ObjectId.isValid(postId);
    const findBlog = await blogsService.getBlogById(data.blogId);

    if (isValidId && findBlog) {
      const res = await postsCollection.updateOne({ _id: new ObjectId(postId) }, { $set: data });
      return res.modifiedCount > 0;
    }

    return false;
  },

  deleteAllPosts: async (): Promise<boolean> => {
    const res = await postsCollection.deleteMany({});
    return res.deletedCount > 0;
  },
};
