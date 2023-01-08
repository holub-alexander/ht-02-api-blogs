import express from "express";
import { deleteAllHandler } from "../controllers/testing.controller";

const testingRouter = express.Router();

testingRouter.delete("/all-data", deleteAllHandler);

export default testingRouter;
