import mongoose from "mongoose";
import { connectDB } from "./Service/ConnectDB.services";

connectDB();

const airadminSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    airline_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "airline",
    },
  },
  { timestamps: true }
);

export const airlineAdminModel = mongoose.model(
  "airline-admin",
  airadminSchema
);
