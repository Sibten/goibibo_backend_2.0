import { number } from "joi";
import mongoose from "mongoose";

const c = mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => d)
  .catch((e) => e);

const roleSchema = new mongoose.Schema(
  {
    role_id: Number,
    role_name: String,
  },
  { timestamps: true }
);

export const roleModel = mongoose.model("role", roleSchema);
