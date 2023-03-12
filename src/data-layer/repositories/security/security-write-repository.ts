import { ObjectId } from "mongodb";
import { RefreshTokenMeta } from "../../../@types";
import { usersCollection } from "../../adapters/mongo-db";

export class SecurityWriteRepository {
  async addSecurityDeviceForUser(userId: ObjectId, refreshTokenMetaData: RefreshTokenMeta): Promise<boolean> {
    const res = await usersCollection.updateOne(
      { _id: userId },
      {
        $push: {
          refreshTokensMeta: refreshTokenMetaData,
        },
      }
    );

    return res.modifiedCount === 1;
  }

  async updateDeviceRefreshToken({
    deviceId,
    expirationDate,
    issuedAt,
    newIssuedAt,
  }: {
    deviceId: string;
    expirationDate: Date;
    issuedAt: Date;
    newIssuedAt: Date;
  }) {
    const res = await usersCollection.updateOne(
      { "refreshTokensMeta.deviceId": deviceId, "refreshTokensMeta.issuedAt": issuedAt },
      {
        $set: {
          "refreshTokensMeta.$.deviceId": deviceId,
          "refreshTokensMeta.$.issuedAt": newIssuedAt,
          "refreshTokensMeta.$.expirationDate": expirationDate,
        },
      }
    );

    return res.modifiedCount === 1;
  }

  async deleteDeviceSessionById(login: string, deviceId: string): Promise<boolean> {
    const res = await usersCollection.updateOne(
      { "accountData.login": login, "refreshTokensMeta.deviceId": deviceId },
      { $pull: { refreshTokensMeta: { deviceId } } }
    );

    return res.modifiedCount === 1;
  }

  async deleteAllDeviceSessions(userId: ObjectId, deviceId: string): Promise<boolean> {
    const res = await usersCollection.updateOne(
      { _id: userId },
      { $pull: { refreshTokensMeta: { deviceId: { $ne: deviceId } } } }
    );

    return res.modifiedCount === 1;
  }
}
