import { Request, Response, NextFunction } from "express";

// Boilerplate middleware that always allows the request to proceed
export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
}
