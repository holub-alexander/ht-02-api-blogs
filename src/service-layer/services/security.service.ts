import { ObjectId } from "mongodb";
import { securityWriteRepository } from "../../data-layer/repositories/security/security-write.repository";
import add from "date-fns/add";
import { RefreshTokenMeta, UserRefreshTokenPayload } from "../../@types";
import { v4 as uuidv4 } from "uuid";
import { jwtToken } from "../../business-layer/security/jwt-token";

export const securityService = {
  /* TODO: Change expirationDate */

  addSecurityDeviceForUser: async ({
    userId,
    ip,
    userAgent = "",
  }: {
    userId: ObjectId;
    ip: string;
    userAgent?: string;
  }): Promise<{ deviceId: string; issuedAt: Date } | null> => {
    const data: RefreshTokenMeta = {
      issuedAt: new Date(new Date().setMilliseconds(0)),
      expirationDate: add(new Date(), {
        seconds: 20,
      }),
      deviceId: uuidv4(),
      title: userAgent,
      ip,
    };

    const res = await securityWriteRepository.addSecurityDeviceForUser(userId, data);

    return res ? { deviceId: data.deviceId, issuedAt: data.issuedAt } : null;
  },

  updateDeviceRefreshToken: async ({
    login,
    deviceId,
    iat,
  }: {
    login: string;
    deviceId: string;
    iat: number;
  }): Promise<string | null> => {
    const newIssuedAtWithoutMs = new Date(new Date().setMilliseconds(0));

    const data = {
      deviceId,
      expirationDate: add(new Date(), {
        seconds: 20,
      }),
      issuedAt: new Date(iat * 1000),
      newIssuedAt: newIssuedAtWithoutMs,
    };

    const isUpdated = await securityWriteRepository.updateDeviceRefreshToken(data);

    if (isUpdated) {
      return await jwtToken(
        {
          login,
          deviceId,
          iat: newIssuedAtWithoutMs.valueOf() / 1000,
        } as UserRefreshTokenPayload,
        process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
        "20s"
      );
    }

    return null;
  },
};
