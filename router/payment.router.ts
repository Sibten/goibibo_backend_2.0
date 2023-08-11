import e from "express";
import {
  IssueRefund,
  createPaymentOrder,
  getMyPayments,
  validatePayment,
} from "../controller/payment.controller";
import { authorizedUser } from "../middleware/authorized";
import { roles } from "../helper/enums";

export const paymentRouter = e.Router();

paymentRouter.use((req, res, next) =>
  authorizedUser(req, res, next, roles.User)
);
paymentRouter.post("/create", createPaymentOrder);
paymentRouter.post("/validate", validatePayment);
paymentRouter.get("/my_payments", getMyPayments);
paymentRouter.post("/issue_refund", IssueRefund);