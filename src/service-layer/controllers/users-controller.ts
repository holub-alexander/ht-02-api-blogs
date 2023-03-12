import { Request, Response } from "express";
import { constants } from "http2";
import { PaginationAndSortQueryParams } from "../../@types";
import { UserInputModel } from "../request/request-types";
import { UsersWriteRepository } from "../../data-layer/repositories/users/users-write-repository";
import { UsersService } from "../services/users-service";

export type UsersQueryParams = PaginationAndSortQueryParams & { searchLoginTerm?: string; searchEmailTerm?: string };

export class UsersController {
  constructor(private usersWriteRepository: UsersWriteRepository, private usersService: UsersService) {}

  async getUsersHandler(req: Request<{}, {}, {}, UsersQueryParams>, res: Response) {
    const { sortBy, sortDirection, pageNumber, pageSize, searchEmailTerm, searchLoginTerm } = req.query;
    const data = await this.usersService.getAllUsers({
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
    });

    res.status(constants.HTTP_STATUS_OK).send(data);
  }

  async createUserHandler(req: Request<{}, {}, UserInputModel>, res: Response) {
    const data = await this.usersService.createUser(req.body);

    if (!data) {
      return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
    }

    res.status(constants.HTTP_STATUS_CREATED).send(data);
  }

  async deleteUserHandler(req: Request<{ id: string }>, res: Response) {
    const isDeleted = await this.usersWriteRepository.deleteUser(req.params.id);

    res.sendStatus(isDeleted ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
  }
}
