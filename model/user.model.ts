import mongoose from "mongoose";





export const userschema: mongoose.Schema = new mongoose.Schema(
  {
    profile_photo: String,
    role: { type: mongoose.Types.ObjectId, ref: "role" },
    user_name: String,
    first_name: String,
    last_name: String,
    email: { type: String, required: true },
    password: String,
    gender: String,
    date_of_birth: Date,
    billing_address: String,
    city: String,
    nationality: String,
    state: String,
    pincode: Number,
  },
  { timestamps: true }
);

export const userModel = mongoose.model("user", userschema);
