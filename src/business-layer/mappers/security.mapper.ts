import { DeviceViewModel } from "../../service-layer/response/responseTypes";

import { RefreshTokenMeta } from "../../@types";

export const securityMapper = {
  getAllDevicesForUser: (data: RefreshTokenMeta[]): DeviceViewModel[] | [] => {
    return data.map((device) => ({
      ip: device.ip,
      title: device.title,
      deviceId: device.deviceId,
      lastActiveDate: device.issuedAt,
    }));
  },
};
