import mongoose from "mongoose";

import { connectDB } from "./Service/ConnectDB.services";

connectDB();

const fareSchema = new mongoose.Schema(
  {
    airline_id: { type: mongoose.Types.ObjectId, ref: "airline" },
    fare: [{ class_type: Number, basic_fare: Number }],
    tax: Number,
  },
  { timestamps: true }
);

export const fareModel = mongoose.model("fare", fareSchema);
