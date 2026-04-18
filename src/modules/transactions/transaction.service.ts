import type { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import transactionModel, {
  ITransaction,
} from "../../DB/models/transactions.model";
import { AppError } from "../../utils/global-error-handler";
import { AuthenticatedRequest } from "../../common/middleware/authentication";
import bankAccountModel, {
  IBankAccount,
} from "../../DB/models/bank_account.model";
import {
  TransactionEnum,
  TransactionStatusEnum,
} from "../../common/enum/transaction.enum";

class TransactionService {
  private readonly _transactionModel: Model<ITransaction> = transactionModel;
  private readonly _bankAccountModel: Model<IBankAccount> = bankAccountModel;

  constructor() {}

  deposit = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { amount, inSystem } = req.body;

    try {
      const deposit = await this._transactionModel.create({
        type: "deposit",
        amount,
        inSystem,
        userId: req.user._id,
        status: TransactionStatusEnum.pending,
      });

      const updateBalance = await this._bankAccountModel.findOneAndUpdate(
        { userId: req.user._id },
        { $inc: { balance: amount } },
      );

      const updateTransactionStatus =
        await this._transactionModel.findByIdAndUpdate(deposit._id, {
          status: TransactionStatusEnum.completed,
        });

      res.status(201).json({
        message: "Deposit created successfully",
        data: deposit,
        balance: updateBalance?.balance ?? 0,
      });
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
    }
  };

  withdraw = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { amount } = req.body;

    try {
      const checkBalance = await this._bankAccountModel
        .findOne({ userId: req.user._id })
        .select("balance");

      if (!checkBalance || checkBalance.balance < amount) {
        throw new AppError("Insufficient balance", 400);
      }

      const withdraw = await this._transactionModel.create({
        type: "withdraw",
        amount,
        userId: req.user._id,
        status: TransactionStatusEnum.pending,
      });

      const updateBalance = await this._bankAccountModel.findOneAndUpdate(
        { userId: req.user._id },
        { $inc: { balance: -amount } },
      );

      const updateTransactionStatus =
        await this._transactionModel.findByIdAndUpdate(withdraw._id, {
          status: TransactionStatusEnum.completed,
        });

      res.status(201).json({
        message: "Withdraw created successfully",
        data: withdraw,
        balance: updateBalance?.balance ?? 0,
      });
    } catch (e: any) {
      res.status(400).json({
        message: e.message,
      });
    }
  };

  transfer = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { amount, inSystem, accountNumberTransformer } = req.body;

    try {
      const checkBalance = await this._bankAccountModel
        .findOne({ userId: req.user._id })
        .select("balance");

      if (!checkBalance || checkBalance.balance < amount) {
        throw new AppError("Insufficient balance", 400);
      }

      const findUserByAccountNumber = await this._bankAccountModel
        .findOne({ accountNumber: accountNumberTransformer })
        .select("userId");

      if (!findUserByAccountNumber) {
        throw new AppError("Recipient account not found", 404);
      }

      const transfer = await this._transactionModel.create({
        type: "transfer",
        amount,
        userId: req.user._id,
        inSystem,
        status: TransactionStatusEnum.pending,
        transferTo: findUserByAccountNumber.userId,
      });

      const updateBalance = await this._bankAccountModel.findOneAndUpdate(
        { userId: req.user._id },
        { $inc: { balance: -amount } },
      );

      const updateTransactionStatus =
        await this._transactionModel.findByIdAndUpdate(transfer._id, {
          status: TransactionStatusEnum.completed,
        });

      res.status(201).json({
        message: "Transfer created successfully",
        data: transfer,
        balance: updateBalance?.balance ?? 0,
      });
    } catch (e: any) {
      res.status(400).json({
        message: e.message,
      });
    }
  };

  mySummary = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    try {
      const transactions = await this._transactionModel
        .find({ userId: req.user._id })
        .select("amount type status createdAt")
        .populate("transferTo", "firstName lastName")
        .sort({ createdAt: -1 });

      const balance = await this._bankAccountModel
        .findOne({ userId: req.user._id })
        .select("balance");

      res.status(200).json({
        message: "Transactions fetched successfully",
        data: transactions,
        balance: balance?.balance ?? 0,
      });
    } catch (e: any) {
      res.status(400).json({
        message: e.message,
      });
    }
  };

  myTransaction = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    try {
      const transactions = await this._transactionModel
        .find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(1)
        .limit(3);

      res.status(200).json({
        message: "Transactions fetched successfully",
        data: transactions,
      });
    } catch (e: any) {
      res.status(400).json({
        message: e.message,
      });
    }
  };

  findTransactionById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    try {
      const transaction = await this._transactionModel.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!transaction) {
        throw new AppError("Transaction not found", 404);
      }

      res.status(200).json({
        message: "Transaction fetched successfully",
        data: transaction,
      });
    } catch (e: any) {
      res.status(400).json({
        message: e.message,
      });
    }
  };
}

export default new TransactionService();
