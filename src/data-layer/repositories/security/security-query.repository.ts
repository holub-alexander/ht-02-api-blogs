import { usersCollection } from "../../adapters/mongoDB";
import { WithId } from "mongodb";
import { UserAccountDBType } from "../../../@types";

export const securityQueryRepository = {
  getUserByDeviceId: async (deviceId: string) =>
    usersCollection.findOne<WithId<UserAccountDBType>>({ "refreshTokensMeta.deviceId": deviceId }),
};
