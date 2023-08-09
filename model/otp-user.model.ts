import mongoose from "mongoose";



const otpSchema = new mongoose.Schema(
  {
    email: String,
    otp: Number,
    sent_time: Date,
    expriy_time: Date,
  },
  { timestamps: true }
);

export const otpModel = mongoose.model("otp", otpSchema);
