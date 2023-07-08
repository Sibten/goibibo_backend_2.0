import { number } from "joi";
import mongoose from "mongoose";

import { connectDB } from "./Service/ConnectDB.services";

connectDB();

const roleSchema = new mongoose.Schema(
  {
    role_id: Number,
    role_name: String,
  },
  { timestamps: true }
);

export const roleModel = mongoose.model("role", roleSchema);
