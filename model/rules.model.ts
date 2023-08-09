import mongoose from "mongoose";





const ruleSchema = new mongoose.Schema(
  {
    airline_id: { type: mongoose.Types.ObjectId, ref: "airline" },
    luggage: [],
  },
  { timestamps: true }
);

export const ruleModel = mongoose.model("rule", ruleSchema);
