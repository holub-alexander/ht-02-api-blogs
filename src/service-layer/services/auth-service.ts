import {
  LoginInputModel,
  NewPasswordRecoveryInputModel,
  RegistrationConfirmationCodeModel,
  RegistrationEmailResending,
  UserInputModel,
} from "../request/request-types";
import { UsersQueryRepository } from "../../data-layer/repositories/users/users-query-repository";
import bcrypt from "bcrypt";
import { AuthMapper } from "../../business-layer/mappers/auth-mapper";
import { emailManager } from "../../data-layer/managers/emailManager";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import { UsersWriteRepository } from "../../data-layer/repositories/users/users-write-repository";
import { UserAccountDBType, UserRefreshTokenPayload } from "../../@types";
import { ObjectId, WithId } from "mongodb";
import { CustomError } from "../../utils/classes/CustomError";
import { jwtToken } from "../../business-layer/security/jwt-token";
import { SecurityService } from "./security-service";
import { SecurityWriteRepository } from "../../data-layer/repositories/security/security-write-repository";
import { getPasswordHash } from "../../utils/common/get-password-hash";

export class AuthService {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersWriteRepository: UsersWriteRepository,
    private securityWriteRepository: SecurityWriteRepository,
    private securityService: SecurityService
  ) {}

  async checkCredentials({ loginOrEmail, password }: LoginInputModel): Promise<boolean> {
    const user = await this.usersQueryRepository.getUserByLoginOrEmailOnly(loginOrEmail);

    if (!user) return false;

    return await bcrypt.compare(password, user.accountData.password);
  }

  async getInformationAboutUser(loginOrEmail = "") {
    const user = await this.usersQueryRepository.getUserByLoginOrEmailOnly(loginOrEmail);

    if (!user) return false;

    return AuthMapper.mapMeViewModel(user);
  }

  async loginUser({
    loginOrEmail,
    password,
    ip,
    userAgent,
  }: {
    loginOrEmail: string;
    password: string;
    ip: string;
    userAgent?: string;
  }): Promise<{ refreshToken: string; accessToken: string } | null> {
    const user = await this.usersQueryRepository.getUserByLoginOrEmailOnly(loginOrEmail);
    /* TODO: TEST */
    const isCorrectCredentials = await this.checkCredentials({
      loginOrEmail: loginOrEmail,
      password: password,
    });

    if (!isCorrectCredentials || !user) {
      return null;
    }

    const addedSecurityDevice = await this.securityService.addSecurityDeviceForUser({
      userId: user._id,
      userAgent,
      ip,
    });

    if (!addedSecurityDevice) {
      return null;
    }

    /* TODO: test */
    const accessToken = await jwtToken(
      { login: user.accountData.login },
      process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
      "10m"
    );

    /* TODO: test */
    const refreshToken = await jwtToken(
      {
        login: user.accountData.login,
        deviceId: addedSecurityDevice.deviceId,
        iat: Math.round(addedSecurityDevice.issuedAt.valueOf() / 1000),
      },
      process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
      "2h"
    );

    return { refreshToken, accessToken };
  }

  async registrationUser(body: UserInputModel): Promise<UserAccountDBType | null> {
    const findUserByLogin = await this.usersQueryRepository.getUserByLogin(body.login);
    const findUserByEmail = await this.usersQueryRepository.getUserByEmail(body.email);

    if (findUserByLogin) {
      throw new CustomError("User with this login already exists", "login");
    }

    if (findUserByEmail) {
      throw new CustomError("User with this email already exists", "email");
    }

    const passwordHash = await getPasswordHash(body.password);
    const userData: UserAccountDBType = {
      _id: new ObjectId(),
      accountData: { ...body, password: passwordHash, createdAt: new Date().toISOString() },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
      passwordRecovery: {
        recoveryCode: null,
      },
      refreshTokensMeta: [],
      comments: {
        likeComments: [],
        dislikeComments: [],
      },
    };

    const createdUser = await this.usersWriteRepository.createUser(userData);

    if (createdUser) {
      await emailManager.sendConfirmationCodeEmail(
        createdUser.accountData.email,
        createdUser.emailConfirmation.confirmationCode ?? ""
      );
    }

    return createdUser;
  }

  async confirmRegistration(body: RegistrationConfirmationCodeModel): Promise<boolean> {
    const findUser = await this.usersQueryRepository.getUserByConfirmationCode(body.code);

    console.log(findUser);

    if (!findUser) return false;
    if (findUser.emailConfirmation.isConfirmed) return false;
    if (findUser.emailConfirmation.confirmationCode !== body.code) return false;
    if (findUser.emailConfirmation.expirationDate && findUser.emailConfirmation.expirationDate <= new Date())
      return false;

    return await this.usersWriteRepository.userConfirmRegistration(findUser._id);
  }

  async registrationEmailResending(body: RegistrationEmailResending) {
    const user = await this.usersQueryRepository.getUserByLoginOrEmailOnly(body.email);

    console.log(user);

    if (!user || user.emailConfirmation.isConfirmed) {
      return false;
    }

    const newConfirmationCode = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 1,
      }),
    };

    const isUpdateConfirmationCode = await this.usersWriteRepository.updateConfirmationCode(
      user._id,
      newConfirmationCode
    );

    if (isUpdateConfirmationCode) {
      await emailManager.sendConfirmationCodeEmail(user.accountData.email, newConfirmationCode.confirmationCode);

      return true;
    }
  }

  async updateTokens(
    refreshTokenPayload: UserRefreshTokenPayload
  ): Promise<null | { accessToken: string; refreshToken: string }> {
    const user = await this.usersQueryRepository.getUserByDeviceIdAndLogin(
      refreshTokenPayload.login,
      refreshTokenPayload.deviceId
    );

    if (!user) {
      return null;
    }

    const newRefreshToken = await this.securityService.updateDeviceRefreshToken({
      login: user.accountData.login,
      iat: refreshTokenPayload.iat,
      deviceId: refreshTokenPayload.deviceId,
    });

    if (!newRefreshToken) {
      return null;
    }

    /* TODO: test */
    const accessToken = await jwtToken(
      { login: user.accountData.login },
      process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
      "10m"
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshTokenPayload: UserRefreshTokenPayload): Promise<boolean> {
    return this.securityWriteRepository.deleteDeviceSessionById(
      refreshTokenPayload.login,
      refreshTokenPayload.deviceId
    );
  }

  async passwordRecovery(email: string): Promise<boolean> {
    const recoveryCode = await jwtToken({ email }, process.env.PASSWORD_RECOVERY_PRIVATE_KEY as string, "1h");
    const user = await this.usersQueryRepository.getUserByEmail(email);

    await emailManager.sendPasswordRecoveryEmail(email, recoveryCode);

    if (!user) {
      return true;
    }

    await this.usersWriteRepository.addPasswordRecoveryData(user._id, recoveryCode);

    return true;
  }

  async confirmPasswordRecovery({ newPassword, recoveryCode }: NewPasswordRecoveryInputModel): Promise<boolean> {
    const passwordHash = await getPasswordHash(newPassword);

    return this.usersWriteRepository.confirmPasswordRecovery({ passwordHash, recoveryCode });
  }
}
