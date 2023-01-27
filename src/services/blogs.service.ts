import { Paginator, SortDirections } from "../@types";
import { blogsCollection } from "../data-layer/adapters/mongoDB";
import { ObjectId, WithId } from "mongodb";
import { getObjectToSort } from "../utils/common/getObjectToSort";
import { BlogsQueryParams } from "../service-layer/controllers/blogs.controller";
import { BlogInputModel } from "../service-layer/request/requestTypes";
import { BlogViewModel } from "../service-layer/response/responseTypes";

export const blogsService = {
  getAllBlogs: async ({
    sortBy = "createdAt",
    sortDirection = SortDirections.DESC,
    searchNameTerm = "",
    pageSize = 10,
    pageNumber = 1,
  }: BlogsQueryParams): Promise<Paginator<BlogViewModel[]>> => {
    const sorting = getObjectToSort({ sortBy, sortDirection });
    const pageSizeValue = pageSize < 1 ? 1 : pageSize;
    const filter = { name: { $regex: searchNameTerm, $options: "i" } };

    const totalCount = await blogsCollection.countDocuments(filter);
    const res = await blogsCollection
      .find<WithId<BlogViewModel>>(filter)
      .skip((+pageNumber - 1) * +pageSizeValue)
      .limit(+pageSizeValue)
      .sort(sorting)
      .toArray();

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: res.map((blog) => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
      })) as BlogViewModel[],
    };
  },

  getBlogById: async (blogId: string): Promise<BlogViewModel | null> => {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const data = await blogsCollection.findOne<BlogViewModel & { _id: string }>({ _id: new ObjectId(blogId) });

      if (data) {
        data.id = data._id.toString();
        /* @ts-ignore */
        delete data?._id;

        return data;
      }
    }

    return null;
  },

  createBlog: async (body: BlogInputModel): Promise<BlogViewModel | null> => {
    const data = await blogsCollection.insertOne({ ...body, createdAt: new Date().toISOString() }, {});

    if (data.acknowledged) {
      return blogsService.getBlogById(data.insertedId.toString());
    }

    return null;
  },

  deleteBlog: async (blogId: string): Promise<boolean> => {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const res = await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
      return res.deletedCount > 0;
    }

    return false;
  },

  updateBlogById: async (blogId: string, data: BlogInputModel): Promise<boolean> => {
    const isValidId = ObjectId.isValid(blogId);

    if (isValidId) {
      const res = await blogsCollection.updateOne({ _id: new ObjectId(blogId) }, { $set: data });
      return res.modifiedCount > 0;
    }

    return false;
  },

  deleteAllBlogs: async (): Promise<boolean> => {
    const res = await blogsCollection.deleteMany({});
    return res.deletedCount > 0;
  },
};
