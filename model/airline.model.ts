import mongoose from "mongoose";

const c = mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => d)
  .catch((e) => e);

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
