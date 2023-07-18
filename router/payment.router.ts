import e from "express";
import {
  createPaymentOrder,
  getMyPayments,
  validatePayment,
} from "../controller/payment.controller";
import { authenticateUser } from "../middleware/authenticate";
import { roles } from "../helper/enums";

export const paymentRouter = e.Router();

paymentRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.User)
);
paymentRouter.post("/create", createPaymentOrder);
paymentRouter.post("/validate", validatePayment);
paymentRouter.get("/my_payments", getMyPayments);
