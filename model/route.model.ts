import mongoose from "mongoose";

const c = mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => d)
  .catch((e) => e);

const routeSchema = new mongoose.Schema({
  route_id: String,
  source_city: { type: mongoose.Types.ObjectId, ref: "city", required: true },
  destination_city: {
    type: mongoose.Types.ObjectId,
    ref: "city",
    required: true,
  },
  distance: Number,
});

export const routeModel = mongoose.model("route", routeSchema);
