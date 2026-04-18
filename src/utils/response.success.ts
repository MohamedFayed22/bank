import type { Response } from "express";

type SuccessResponseInput  = {
  res: Response;
  status?: number;
  message?: string;
  data?: any;
};

export const successResponse = ({
  res,
  status = 200,
  message = "done",
  data,
}: SuccessResponseInput) => {
  res.status(status).json({ message, data });
};
