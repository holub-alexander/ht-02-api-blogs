import { usersCollection } from "../../adapters/mongo-db";
import { WithId } from "mongodb";
import { UserAccountDBType } from "../../../@types";

export class SecurityQueryRepository {
  async getUserByDeviceId(deviceId: string): Promise<WithId<UserAccountDBType> | null> {
    return usersCollection.findOne<WithId<UserAccountDBType>>({ "refreshTokensMeta.deviceId": deviceId });
  }
}
