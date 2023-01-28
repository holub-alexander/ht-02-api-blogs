import { Request, Response } from "express";
import { constants } from "http2";
import { PaginationAndSortQueryParams } from "../../@types";
import { usersService } from "../services/users.service";
import { UserInputModel } from "../request/requestTypes";
import { usersWriteRepository } from "../../data-layer/repositories/users/users.write.repository";

export type UsersQueryParams = PaginationAndSortQueryParams & { searchLoginTerm?: string; searchEmailTerm?: string };

export const getUsersHandler = async (req: Request<{}, {}, {}, UsersQueryParams>, res: Response) => {
  const { sortBy, sortDirection, pageNumber, pageSize, searchEmailTerm, searchLoginTerm } = req.query;
  const data = await usersService.getAllUsers({
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
    searchLoginTerm,
    searchEmailTerm,
  });

  res.status(constants.HTTP_STATUS_OK).send(data);
};

export const createUserHandler = async (req: Request<{}, {}, UserInputModel>, res: Response) => {
  const data = await usersService.createUser(req.body);

  if (!data) {
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND);
  }

  res.status(constants.HTTP_STATUS_CREATED).send(data);
};

export const deleteUserHandler = async (req: Request<{ id: string }>, res: Response) => {
  const isDeleted = await usersWriteRepository.deleteUser(req.params.id);

  res.sendStatus(isDeleted ? constants.HTTP_STATUS_NO_CONTENT : constants.HTTP_STATUS_NOT_FOUND);
};
