import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "../lib/utils";
import userRouter from "../api/users/user.routes";
const router = Router();

// Root route
router.get("/", (req, res) => {
  return res.send("Server running");
});

router.use("/api/users", userRouter);

// 404 handler (should be after all other routes)
router.use((req, res) => {
  const message = "404 | Resource not found!";
  sendResponse(res, null, message, false, 404, null);
});

router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", error);

  if (error.status === 422) {
    sendResponse(
      res,
      null,
      error.message || "Error",
      false,
      error.status,
      error.details
    );
    return;
  }

  if (error.name === "ValidationError") {
    sendResponse(res, null, error.message || "Error", false, 500, error.errors);
    return;
  }

  const statusCode = error.status || 500;
  const issue: any = {};

  issue.message = `${error.message}`;
  issue.stack = process.env.NODE_ENV !== "production" ? error.stack : "";

  sendResponse(
    res,
    null,
    issue.message,
    false,
    statusCode,
    statusCode === 400 ? null : issue
  );
});

export default router;
