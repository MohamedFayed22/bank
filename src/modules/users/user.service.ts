import type { NextFunction, Response } from "express";
import { Model } from "mongoose";
import type { AuthenticatedRequest } from "../../common/middleware/authentication";
import bankAccountModel, {
  IBankAccount,
} from "../../DB/models/bank_account.model";
import { AppError } from "../../utils/global-error-handler";
import { successResponse } from "../../utils/response.success";
import { RoleEnum } from "../../common/enum/user.enum";

class UserService {
  private readonly _bankAccountModel: Model<IBankAccount> = bankAccountModel;

  constructor() {}

  profile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const bankAccount = await this._bankAccountModel.findOne({
      userId: req.user._id,
    });

    successResponse({
      res,
      status: 200,
      message: "User profile fetched successfully",
      data: {
        data: req.user,
        bankAccount: bankAccount,
      },
    });
  };

  disableAccount = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { accountNumber } = req.body;

    if (!req.user || req.user.role !== RoleEnum.admin) {
      throw new AppError("Unauthorized", 401);
    }

    const updateStatus = await this._bankAccountModel.findOneAndUpdate(
      { accountNumber: accountNumber },
      { status: "disabled" },
    );

    successResponse({
      res,
      status: 200,
      message: "User disabled successfully",
    });
  };
}

export default new UserService();
