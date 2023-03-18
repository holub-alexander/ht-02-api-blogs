import { DeviceViewModel } from "../../service-layer/response/response-types";

import { RefreshTokenMeta } from "../../@types";

export class SecurityMapper {
  public static getAllDevicesForUser(data: RefreshTokenMeta[]): DeviceViewModel[] {
    return data.map((device) => ({
      ip: device.ip,
      title: device.title,
      deviceId: device.deviceId,
      lastActiveDate: device.issuedAt,
    }));
  }
}
