import mongoose from "mongoose";




const flightSchema = new mongoose.Schema(
  {
    flight_no: String,
    is_international: Boolean,
    airline_id: { type: mongoose.Types.ObjectId, ref: "airline" },
    route_id: { type: mongoose.Types.ObjectId, ref: "route" },
    airbus_id: { type: mongoose.Types.ObjectId, ref: "airbus" },
    fare: { type: mongoose.Types.ObjectId, ref: "fare" },
    status: Number,
    timing: [{ source_time: Date, destination_time: Date }],
    available_seats: [
      { date: Date, BC: Number, EC: Number, PE: Number, FC: Number },
    ],
    booked_seats: [
      { date: Date, BC: [String], EC: [String], PE: [String], FC: [String] },
    ],
    booking_id: [{ date: Date, id: [] }],
    rule: { type: mongoose.Types.ObjectId, ref: "rule" },
  },
  { timestamps: true }
);

export const flightModel = mongoose.model("flight", flightSchema);
