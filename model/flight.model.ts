import { bool } from "joi";
import mongoose from "mongoose";

const c = mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => d)
  .catch((e) => e);

const flightSchema = new mongoose.Schema({
  flight_no: String,
  airline_id: { type: mongoose.Types.ObjectId, ref: "airline" },
  route_id: { type: mongoose.Types.ObjectId, ref: "route" },
  status: Number,
  running_days: {
    sunday: Boolean,
    monday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean,
    thursday: Boolean,
    friday: Boolean,
    saturday: Boolean,
  },
  timing: [{ source_time: Date, destination_time: Date }],
  available_class: { BC: Boolean, EC: Boolean },
});
