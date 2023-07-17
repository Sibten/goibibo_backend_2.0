import mongoose from "mongoose";
import { connectDB } from "./Service/ConnectDB.services";
import { number } from "joi";

connectDB();

const addOnSchema = new mongoose.Schema({
  type: Number,
  name: String,
  icon: String,
  limit: Number,
  price: Number,
});

export const addonModel = mongoose.model("addon", addOnSchema);
