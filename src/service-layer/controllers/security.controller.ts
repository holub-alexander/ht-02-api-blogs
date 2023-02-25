import { Request, Response } from "express";
import { DeviceViewModel } from "../response/responseTypes";
import { usersQueryRepository } from "../../data-layer/repositories/users/users.query.repository";
import { securityMapper } from "../../business-layer/mappers/security.mapper";
import { constants } from "http2";
import { securityQueryRepository } from "../../data-layer/repositories/security/security-query.repository";
import { securityWriteRepository } from "../../data-layer/repositories/security/security-write.repository";

export const getAllDevicesWithActiveSessionsForUserHandler = async (req: Request, res: Response<DeviceViewModel[]>) => {
  const user = await usersQueryRepository.getUserByLogin(req.userRefreshTokenPayload.login);

  if (!user) {
    return res.sendStatus(401);
  }

  const formatData = securityMapper.getAllDevicesForUser(user.refreshTokensMeta);

  res.status(constants.HTTP_STATUS_OK).send(formatData);
};

export const deleteAllDevicesWithActiveSessionsHandler = async (req: Request, res: Response) => {
  const user = await usersQueryRepository.getUserByDeviceIdAndLogin(
    req.userRefreshTokenPayload.login,
    req.userRefreshTokenPayload.deviceId
  );

  if (!user) {
    return res.sendStatus(401);
  }

  const data = await securityWriteRepository.deleteAllDeviceSessions(user._id, req.userRefreshTokenPayload.deviceId);

  console.log(data);

  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
};

export const deleteDeviceSessionByIdHandler = async (req: Request<{ deviceId: string }>, res: Response) => {
  const findUser = await securityQueryRepository.getUserByDeviceId(req.params.deviceId);

  if (!findUser) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  if (findUser && findUser.accountData.login !== req.userRefreshTokenPayload.login) {
    return res.sendStatus(constants.HTTP_STATUS_FORBIDDEN);
  }

  const response = await securityWriteRepository.deleteDeviceSessionById(
    req.userRefreshTokenPayload.login,
    req.params.deviceId
  );

  if (!response) {
    return res.sendStatus(401);
  }

  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
};
