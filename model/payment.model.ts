import mongoose from "mongoose";
import { connectDB } from "./Service/ConnectDB.services";

connectDB();

const PaymentSchema = new mongoose.Schema({
  payment_id: String,
  transaction_stamp: Date,
  type: Number,
  status: Number,
  payment_amount: Number,
});

export const paymentModel = mongoose.model("payment", PaymentSchema);
