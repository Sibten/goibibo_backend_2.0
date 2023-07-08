import mongoose from "mongoose";
import { connectDB } from "./Service/ConnectDB.services";

connectDB();

const airbusSchema = new mongoose.Schema(
  {
    airbus_code: String,
    available_class: { BC: Boolean, EC: Boolean, PE: Boolean, FC: Boolean },
    seat_map: [
      {
        class_type: Number,
        row_start: Number,
        row_end: Number,
        col_start: String,
        col_gap: String,
        col_end: String,
      },
    ],
  },
  { timestamps: true }
);

export const airbusModel = mongoose.model("airbus", airbusSchema);
