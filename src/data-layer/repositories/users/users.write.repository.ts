import { UserInputModel } from "../../../service-layer/request/requestTypes";
import { UserViewModel } from "../../../service-layer/response/responseTypes";
import { usersCollection } from "../../adapters/mongoDB";
import { usersQueryRepository } from "./users.query.repository";
import { ObjectId, WithId } from "mongodb";

export const usersWriteRepository = {
  createUser: async (body: UserInputModel): Promise<WithId<UserViewModel> | null> => {
    const data = await usersCollection.insertOne({ ...body, createdAt: new Date().toISOString() }, {});

    if (data.acknowledged) {
      return usersQueryRepository.getUserById<UserViewModel>(data.insertedId.toString());
    }

    return null;
  },

  deleteUser: async (userId: string): Promise<boolean> => {
    const isValidId = ObjectId.isValid(userId);

    if (isValidId) {
      const res = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
      return res.deletedCount > 0;
    }

    return false;
  },

  deleteAllUsers: async (): Promise<boolean> => {
    const res = await usersCollection.deleteMany({});
    return res.deletedCount > 0;
  },
};
