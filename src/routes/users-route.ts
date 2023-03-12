import express from "express";
import { validate } from "../middleware/custom/validate";
import { basicAuth } from "../middleware/custom/basic-auth";
import { userQuerySchema, userSchema } from "../business-layer/validators/schemas/user-schema";
import { usersController } from "../data-layer/composition-root";

const usersRouter = express.Router();

usersRouter.get("/", basicAuth, ...userQuerySchema, validate, usersController.getUsersHandler.bind(usersController));
usersRouter.post("/", basicAuth, userSchema, validate, usersController.createUserHandler.bind(usersController));
usersRouter.delete("/:id", basicAuth, usersController.deleteUserHandler.bind(usersController));

export default usersRouter;
