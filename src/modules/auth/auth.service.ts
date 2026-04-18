import type { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { randomUUID } from "crypto";
import userModel, { IUser } from "../../DB/models/user.model";
import bankAccountModel, {
  IBankAccount,
} from "../../DB/models/bank_account.model";
import { StatusEnum } from "../../common/enum/bank_account.enum";
import { Compare, Hash } from "../../utils/hash.security";
import { generateToken } from "../../utils/token.service";
import { AppError } from "../../utils/global-error-handler";
import {
  salt_rounds_config,
  secret_key_config,
} from "../../config/config.service";
import type { AuthenticatedRequest } from "../../common/middleware/authentication";
import { ISingInSchema, ISingUpType } from "./auth.validation";

class AuthService {
  private readonly _userModel: Model<IUser> = userModel;
  private readonly _bankAccountModel: Model<IBankAccount> = bankAccountModel;

  constructor() {}

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, age, currency }: ISingUpType = req.body;

    if (
      await this._userModel.findOne({
        email,
      })
    ) {
      throw new AppError("User Register exist", 400);
    }

    if (age < 18 || age > 60) {
      throw new AppError("Age must be between 18 and 60", 400);
    }

    const hashedPassword = Hash({
      plainText: password,
      salt_rounds: salt_rounds_config,
    });

    const user = await this._userModel.create({
      fullName,
      email,
      password: hashedPassword,
      age,
    });

    const accountBankData = await this._bankAccountModel.create({
      userId: user._id,
      accountNumber: Math.floor(
        1000000000 + Math.random() * 9000000000,
      ).toString(),
      balance: 0,
      currency,
      status: StatusEnum.active,
    });

    res.status(200).json({
      message: "Sign up successful",
      user: user,
      accountBankData,
    });
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: ISingInSchema = req.body;

    const user = await this._userModel.findOne({
      email,
    }).select("-password");

    if (
      !user ||
      !Compare({ plainText: password, cipher_text: user.password })
    ) {
      throw new AppError("Invalid email or password", 400);
    }

    const jwtId = randomUUID();

    const accessToken = generateToken({
      payload: { id: user._id.toString(), email: user.email },
      secret_key: secret_key_config,
      options: { jwtid: jwtId, expiresIn: "1d" },
    });

    res.status(200).json({
      message: "Sign In successful",
      data: {
        access_token: accessToken,
        user: user,
      },
    });
  };

  profile = async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.authUser) {
      throw new AppError("Unauthorized", 401);
    }

    const bankAccount = await this._bankAccountModel.findOne({
      userId: authReq.authUser._id,
    }).select("-password");

    res.status(200).json({
      message: "Profile fetched successfully",
      data: {
        user: authReq.authUser,
        bankAccount,
      },
    });
  };
}

export default new AuthService();
