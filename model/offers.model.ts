import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    offer_name: String,
    referal_code: String,
    offer_discount: Number,
    valid_till: Date,
    promo: Boolean,
    description: String,
  },
  { timestamps: true }
);

export const offerModel = mongoose.model("offer", offerSchema);
