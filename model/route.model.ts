import mongoose from "mongoose";

import { connectDB } from "./Service/ConnectDB.services";

connectDB();
const routeSchema = new mongoose.Schema(
  {
    route_id: String,
    source_city: { type: mongoose.Types.ObjectId, ref: "city", required: true },
    destination_city: {
      type: mongoose.Types.ObjectId,
      ref: "city",
      required: true,
    },
    stops: [{ type: mongoose.Types.ObjectId, ref: "city" }],
    distance: Number,
  },
  { timestamps: true }
);

export const routeModel = mongoose.model("route", routeSchema);
