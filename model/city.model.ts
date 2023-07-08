import mongoose from "mongoose";

import { connectDB } from "./Service/ConnectDB.services";

connectDB();

const citySchema = new mongoose.Schema(
  {
    city_id: Number,
    city_name: String,
    airport_name: String,
    airport_code: String,
    lat: Number,
    long: Number,
  },
  { timestamps: true }
);

export const cityModel = mongoose.model("city", citySchema);
