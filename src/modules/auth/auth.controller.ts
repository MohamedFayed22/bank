import { Router } from "express";
import AuthService from "./auth.service";
import { validation } from "../../common/middleware/validation";
import { authentication } from "../../common/middleware/authentication";
import * as authValidation from "./auth.validation";

const authRouter = Router();

authRouter.post(
  "/register",
  validation(authValidation.singUpSchema),
  AuthService.signUp,
);
authRouter.post(
  "/login",
  validation(authValidation.singInSchema),
  AuthService.signIn,
);

export default authRouter;
