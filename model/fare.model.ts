import mongoose from "mongoose";

const c = mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => d)
  .catch((e) => e);

const fareSchema = new mongoose.Schema(
  {
    airline_id: { type: mongoose.Types.ObjectId, ref: "airline" },
    fare: [{ class_type: Number, basic_fare: Number }],
    tax: Number,
  },
  { timestamps: true }
);

export const fareModel = mongoose.model("fare", fareSchema);
