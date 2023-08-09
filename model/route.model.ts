import mongoose from "mongoose";




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
    added_by: { type: mongoose.Types.ObjectId, ref: "airline" },
  },
  { timestamps: true }
);

export const routeModel = mongoose.model("route", routeSchema);
