import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => console.log("goibibo connected"))
  .catch((e) => console.log(e));

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
