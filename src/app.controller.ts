import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { PORT } from "./config/config.service";
import type { Request, Response, NextFunction } from "express";
import { AppError, globalErrorHandler } from "./utils/global-error-handler";
import authRouter from "./modules/auth/auth.controller";
import { checkConnectionDB } from "./DB/connectionBB";
import userRouter from "./modules/users/user.controller";
import transactionRouter from "./modules/transactions/transaction.controller";

const app: express.Application = express();

const port: number = Number(PORT);

const bootstrap = () => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction) => {
      throw new AppError("Too many requests, please try again later.", 429);
    },
  });

  app.use(express.json());
  app.use(cors(), helmet(), limiter);

  checkConnectionDB();

  app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: "Welcome to the Social Media APP ......",
    });
  });

  app.use("/auth", authRouter);
  app.use("/accounts", userRouter);
  app.use("/transaction", transactionRouter);

  app.use("{/*demo}", (req: Request, res: Response, next: NextFunction) => {
    throw new AppError(
      `Url ${req.originalUrl} with method ${req.method} not found`,
      404,
    );
  });

  app.use(globalErrorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export default bootstrap;
