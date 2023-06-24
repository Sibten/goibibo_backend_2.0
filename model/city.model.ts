import mongoose from "mongoose";

const c = mongoose.connect("mongodb://localhost:27017/goibibo");

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
