import { RequestHandler, Router } from "express";
import { get } from "http";
import { getUsers } from "./user.controller";
import { userMiddleware } from "./user.middleware";

const userRouter = Router();
userRouter.get("/", userMiddleware, getUsers as RequestHandler);

export default userRouter;
