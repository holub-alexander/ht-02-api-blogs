import { Request, Response } from "express";
import { DeviceViewModel } from "../response/response-types";
import { SecurityMapper } from "../../business-layer/mappers/security-mapper";
import { constants } from "http2";
import { SecurityQueryRepository } from "../../data-layer/repositories/security/security-query-repository";
import { SecurityWriteRepository } from "../../data-layer/repositories/security/security-write-repository";
import { UsersQueryRepository } from "../../data-layer/repositories/users/users-query-repository";

export class SecurityController {
  constructor(
    private securityQueryRepository: SecurityQueryRepository,
    private securityWriteRepository: SecurityWriteRepository,
    private usersQueryRepository: UsersQueryRepository
  ) {}

  async getAllDevicesWithActiveSessionsForUserHandler(req: Request, res: Response<DeviceViewModel[]>) {
    const user = await this.usersQueryRepository.getUserByLogin(req.userRefreshTokenPayload.login);

    if (!user) {
      return res.sendStatus(401);
    }

    const formatData = SecurityMapper.getAllDevicesForUser(user.refreshTokensMeta);

    res.status(constants.HTTP_STATUS_OK).send(formatData);
  }

  async deleteAllDevicesWithActiveSessionsHandler(req: Request, res: Response) {
    const user = await this.usersQueryRepository.getUserByDeviceIdAndLogin(
      req.userRefreshTokenPayload.login,
      req.userRefreshTokenPayload.deviceId
    );

    if (!user) {
      return res.sendStatus(401);
    }

    const data = await this.securityWriteRepository.deleteAllDeviceSessions(
      user._id,
      req.userRefreshTokenPayload.deviceId
    );

    console.log(data);

    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }

  async deleteDeviceSessionByIdHandler(req: Request<{ deviceId: string }>, res: Response) {
    const findUser = await this.securityQueryRepository.getUserByDeviceId(req.params.deviceId);

    if (!findUser) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    if (findUser && findUser.accountData.login !== req.userRefreshTokenPayload.login) {
      return res.sendStatus(constants.HTTP_STATUS_FORBIDDEN);
    }

    const response = await this.securityWriteRepository.deleteDeviceSessionById(
      req.userRefreshTokenPayload.login,
      req.params.deviceId
    );

    if (!response) {
      return res.sendStatus(401);
    }

    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
  }
}
