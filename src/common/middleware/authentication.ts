import type { NextFunction, Request, Response } from "express";
import type { HydratedDocument } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";
import type { IUser } from "../../DB/models/user.model";
import userModel from "../../DB/models/user.model";
import { secret_key_config } from "../../config/config.service";
import { AppError } from "../../utils/global-error-handler";
import { verifyToken } from "../../utils/token.service";

export type TokenPayload = JwtPayload & {
  id: string;
  email?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<IUser>;
      authUser?: HydratedDocument<IUser>;
      decoded?: TokenPayload;
    }
  }
}

export interface AuthenticatedRequest extends Request {}

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Authorization header is required", 401);
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Invalid authorization format", 401);
  }

  try {
    const decoded = verifyToken({
      token,
      secret_key: secret_key_config,
    });

    if (typeof decoded === "string" || typeof decoded.id !== "string") {
      throw new AppError("Invalid token payload", 401);
    }

    const tokenPayload = decoded as TokenPayload;

    req.decoded = tokenPayload;

    const user = await userModel.findById(tokenPayload.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    req.user = user;
    req.authUser = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired token", 401);
  }
};
