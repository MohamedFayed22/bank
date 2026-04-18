import { Router } from "express";
import UserService from "./user.service";
import { authentication } from "../../common/middleware/authentication";
import { validation } from "../../common/middleware/validation";
import * as userValidate from "./user.validation";

const userRouter = Router();

userRouter.get("/me", authentication, UserService.profile);

userRouter.post(
  "/inactive-account",
  validation(userValidate.disableAccountSchema),
  authentication,
  UserService.disableAccount,
);

export default userRouter;
