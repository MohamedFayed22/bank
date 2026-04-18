import mongoose, { Types } from "mongoose";
import { RoleEnum } from "../../common/enum/user.enum";

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  age: number;
  confirmed?: boolean;
  isDeleted: boolean;
  role?: RoleEnum;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 30,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 60,
    },
    age: {
      type: Number,
      required: true,
      trim: true,
      min: 18,
      max: 60,
    },
    role: {
      type: String,
      enum: RoleEnum,
      default: RoleEnum.user,
    },
    confirmed: Boolean,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    strict: true,
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("fullName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (val: string) {
    this.set({
      firstName: val.split(" ")[0],
      lastName: val.split(" ")[1],
    });
  });

const userModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default userModel;
