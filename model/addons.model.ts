import mongoose from "mongoose";

import { number } from "joi";



const addOnSchema = new mongoose.Schema({
  type: Number,
  name: String,
  icon: String,
  limit: Number,
  price: Number,
});

export const addonModel = mongoose.model("addon", addOnSchema);
