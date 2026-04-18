import mongoose, { Types } from "mongoose";
import {
  TransactionEnum,
  TransactionStatusEnum,
  TransactionTypeEnum,
} from "../../common/enum/transaction.enum";

export interface ITransaction {
  _id: Types.ObjectId;
  type: string;
  userId: Types.ObjectId;
  amount: Number;
  inSystem: string;
  status: string;
  transferTo?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: TransactionEnum,
      required: true,
      default: TransactionEnum.deposit,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    inSystem: {
      type: String,
      required: true,
      enum: TransactionTypeEnum,
      default: TransactionTypeEnum.inSystem,
    },
    status: {
      type: String,
      required: true,
      enum: TransactionStatusEnum,
      default: TransactionStatusEnum.pending,
    },
    transferTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    strict: true,
    toObject: { virtuals: true },
  },
);

const transactionModel =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", transactionSchema);
export default transactionModel;
