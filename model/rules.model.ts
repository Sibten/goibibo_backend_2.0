import mongoose from "mongoose";

import { connectDB } from "./Service/ConnectDB.services";

connectDB();

const ruleSchema = new mongoose.Schema(
  {
    airline_id: { type: mongoose.Types.ObjectId, ref: "airline" },
    luggage: [],
  },
  { timestamps: true }
);

export const ruleModel = mongoose.model("rule", ruleSchema);
