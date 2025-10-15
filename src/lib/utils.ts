import { Response } from "express";
export interface ResponseData<T> {
  data: T | null;
  message: string;
  status: boolean;
  details: any | null;
}

const sendResponse = <T>(
  res: Response<ResponseData<T>>,
  data: T | null = null,
  message = "Success",
  status = true,
  status_code = 200,
  details = null
) => {
  res.status(status_code).json({ data, message, status, details });
};

export { sendResponse };

