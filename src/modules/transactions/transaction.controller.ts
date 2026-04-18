import { Router } from "express";
import { validation } from "../../common/middleware/validation";
import { authentication } from "../../common/middleware/authentication";
import transactionService from "./transaction.service";
import * as transactionValidate from "./transaction.validation";

const transactionRouter = Router();

transactionRouter.post(
  "/deposit",
  authentication,
  validation(transactionValidate.depositSchema),
  transactionService.deposit,
);

transactionRouter.post(
  "/withdraw",
  authentication,
  validation(transactionValidate.withdrawSchema),
  transactionService.withdraw,
);

transactionRouter.post(
  "/transfer",
  authentication,
  validation(transactionValidate.transferSchema),
  transactionService.transfer,
);

transactionRouter.get(
  "/my/summary",
  authentication,
  transactionService.mySummary,
);

transactionRouter.get("/my", authentication, transactionService.myTransaction);

transactionRouter.get(
  "/:id",
  authentication,
  transactionService.findTransactionById,
);

export default transactionRouter;
