import mongoose, { mongo } from "mongoose";

const c = mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => d)
  .catch((e) => e);

const flightSchema = new mongoose.Schema(
  {
    flight_no: String,
    airline_id: { type: mongoose.Types.ObjectId, ref: "airline" },
    route_id: { type: mongoose.Types.ObjectId, ref: "route" },
    airbus_id: { type: mongoose.Types.ObjectId, ref: "airbus" },
    fare: { type: mongoose.Types.ObjectId, ref: "fare" },
    status: Number,
    timing: { source_time: Date, destination_time: Date },
    available_seats: { BC: Number, EC: Number, PE: Number, FC: Number },
    booked_seats: { BC: [String], EC: [String], PE: [String], FC: [String] },
    rule: { type: mongoose.Types.ObjectId, ref: "rule" },
  },
  { timestamps: true }
);

export const flightModel = mongoose.model("flight", flightSchema);
