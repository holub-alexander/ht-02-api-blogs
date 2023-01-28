import express from "express";
import { validate } from "../middleware/custom/validate";
import { basicAuth } from "../middleware/custom/basic-auth";
import { userQuerySchema, userSchema } from "../business-layer/validators/schemas/user-schema";
import { createUserHandler, deleteUserHandler, getUsersHandler } from "../service-layer/controllers/users.controller";

const usersRouter = express.Router();

usersRouter.get("/", basicAuth, ...userQuerySchema, validate, getUsersHandler);
usersRouter.post("/", basicAuth, userSchema, validate, createUserHandler);
usersRouter.delete("/:id", basicAuth, deleteUserHandler);

export default usersRouter;
