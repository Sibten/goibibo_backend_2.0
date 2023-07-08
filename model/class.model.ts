import mongoose from "mongoose";
import { connectDB } from "./Service/ConnectDB.services";

connectDB();

const classSchema = new mongoose.Schema(
  {
    flight_id: { type: mongoose.Types.ObjectId, ref: "flight" },
    class_type: Number,
    fare: Number,
    tax: Number,
  },
  { timestamps: true }
);

export const classModel = mongoose.model("class", classSchema);