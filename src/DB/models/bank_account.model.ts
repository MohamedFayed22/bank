import mongoose, { Types } from "mongoose";
import { CurrencyEnum, StatusEnum } from "../../common/enum/bank_account.enum";

export interface IBankAccount {
  _id: Types.ObjectId;
  accountNumber: string;
  balance: number;
  currency: string;
  userId: Types.ObjectId;
  status?: StatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

const bankAccountSchema = new mongoose.Schema<IBankAccount>(
  {
    accountNumber: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 40,
    },
    currency: {
      type: String,
      enum: CurrencyEnum,
      required: true,
      default: CurrencyEnum.usd,
    },
    balance: Number,
    status: {
      type: String,
      enum: StatusEnum,
      required: true,
      default: StatusEnum.active,
    },
    userId: {
      type: Types.ObjectId,
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

const bankAccountModel =
  mongoose.models.BankAccount ||
  mongoose.model<IBankAccount>("BankAccount", bankAccountSchema);
export default bankAccountModel;
