import mongoose from "mongoose";

const c = mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => d)
  .catch((e) => e);

const ruleSchema = new mongoose.Schema(
  {
    airline_id: { type: mongoose.Types.ObjectId, ref: "airline" },
    luggage: [],
  },
  { timestamps: true }
);

export const ruleModel = mongoose.model("rule", ruleSchema);
