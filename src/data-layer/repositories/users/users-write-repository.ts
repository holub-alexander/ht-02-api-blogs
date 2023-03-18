import { usersCollection } from "../../adapters/mongo-db";

import { ObjectId, WithId } from "mongodb";
import { UserAccountDBType } from "../../../@types";
import { UsersQueryRepository } from "./users-query-repository";

export class UsersWriteRepository {
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async createUser(data: UserAccountDBType): Promise<UserAccountDBType | null> {
    const res = await usersCollection.insertOne(data, {});

    if (res.acknowledged) {
      return this.usersQueryRepository.getUserById<UserAccountDBType>(res.insertedId.toString());
    }

    return null;
  }

  async userConfirmRegistration(_id: ObjectId): Promise<boolean> {
    const res = await usersCollection.updateOne({ _id }, { $set: { "emailConfirmation.isConfirmed": true } });
    return res.modifiedCount === 1;
  }

  async updateConfirmationCode(
    _id: ObjectId,
    { confirmationCode, expirationDate }: { confirmationCode: string; expirationDate: Date }
  ): Promise<boolean> {
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
  }

  async deleteUser(userId: string): Promise<boolean> {
    const isValidId = ObjectId.isValid(userId);

    if (isValidId) {
      const res = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
      return res.deletedCount > 0;
    }

    return false;
  }

  async deleteAllUsers(): Promise<boolean> {
    const res = await usersCollection.deleteMany({});
    return res.deletedCount > 0;
  }

  async addPasswordRecoveryData(userId: ObjectId, recoveryCode: string): Promise<boolean> {
    const res = await usersCollection.updateOne(
      { _id: userId },
      {
        $set: {
          "passwordRecovery.recoveryCode": recoveryCode,
        },
      }
    );

    return res.modifiedCount === 1;
  }

  async confirmPasswordRecovery({ recoveryCode, passwordHash }: { passwordHash: string; recoveryCode: string }) {
    const res = await usersCollection.updateOne(
      { "passwordRecovery.recoveryCode": recoveryCode },
      { $set: { "passwordRecovery.recoveryCode": null, "accountData.password": passwordHash } }
    );

    return res.modifiedCount === 1;
  }
}
