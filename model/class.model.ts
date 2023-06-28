import mongoose from "mongoose";

const c = mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => d)
  .catch((e) => e);

const classSchema = new mongoose.Schema({
  flight_id: { type: mongoose.Types.ObjectId, ref: "flight" },
  class_type: Number,
  fare: Number,
  tax: Number,
});

export const classModel = mongoose.model("class", classSchema);