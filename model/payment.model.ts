import mongoose from "mongoose";





const PaymentSchema = new mongoose.Schema(
  {
    order_id: String,
    razor_pay_id: String,
    transaction_stamp: Date,
    user_id: { type: mongoose.Types.ObjectId, ref: "user" },
    status: Number,
    payment_amount: {
      basic_total: Number,
      tax_total: Number,
      original_total: Number,
      discount: Number,
      promotion: Number,
      total_add_on: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const paymentModel = mongoose.model("payment", PaymentSchema);
