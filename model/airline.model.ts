import mongoose from "mongoose";

import { connectDB } from "./Service/ConnectDB.services";

connectDB();
const airlineSchema = new mongoose.Schema(
  {
    airline_id: { type: String, required: true },
    airline_name: String,
    airline_location: String,
    airline_code: String,
  },
  { timestamps: true }
);

export const airlineModel = mongoose.model("airline", airlineSchema);
