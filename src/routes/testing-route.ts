import express from "express";
import { testingController } from "../data-layer/composition-root";

const testingRouter = express.Router();

testingRouter.delete("/all-data", testingController.deleteAllHandler.bind(testingController));

export default testingRouter;
