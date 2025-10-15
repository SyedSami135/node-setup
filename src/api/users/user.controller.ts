import { db } from "../../lib/db";
import { sendResponse } from "../../lib/utils";
import { Request, Response, NextFunction } from "express";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await db.users.findMany();
    // throw new Error('Test error handling');
    sendResponse(res, users, "Users retrieved successfully", true, 200, null);
  } catch (error) {
    next(error);
  }
};
