import { usersCollection } from "../../adapters/mongoDB";
import { usersQueryRepository } from "./users.query.repository";
import { ObjectId, WithId } from "mongodb";
import { UserAccountDBType } from "../../../@types";

export const usersWriteRepository = {
  createUser: async (data: UserAccountDBType): Promise<WithId<UserAccountDBType> | null> => {
    const res = await usersCollection.insertOne(data, {});

    if (res.acknowledged) {
      return usersQueryRepository.getUserById<UserAccountDBType>(res.insertedId.toString());
    }

    return null;
  },

  userConfirmRegistration: async (_id: ObjectId): Promise<boolean> => {
    const res = await usersCollection.updateOne({ _id }, { $set: { "emailConfirmation.isConfirmed": true } });
    return res.modifiedCount === 1;
  },

  updateConfirmationCode: async (
    _id: ObjectId,
    { confirmationCode, expirationDate }: { confirmationCode: string; expirationDate: Date }
  ): Promise<boolean> => {
    const res = await usersCollection.updateOne(
      { _id },
      {
        $set: {
          "emailConfirmation.confirmationCode": confirmationCode,
          "emailConfirmation.expirationDate": expirationDate,
        },
      }
    );

    return res.modifiedCount === 1;
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

  addTokensForUser: async (userId: ObjectId, accessToken: string, refreshToken: string): Promise<boolean> => {
    const res = await usersCollection.updateOne({ _id: userId }, { $set: { accessToken, refreshToken } });
    return res.modifiedCount === 1;
  },

  resetTokensForUser: async (userId: ObjectId): Promise<boolean> => {
    const res = await usersCollection.updateOne({ _id: userId }, { $set: { accessToken: null, refreshToken: null } });
    return res.modifiedCount === 1;
  },
};
