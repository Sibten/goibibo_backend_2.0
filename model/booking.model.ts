import mongoose from "mongoose";
import { connectDB } from "./Service/ConnectDB.services";

connectDB();

const BookingSchema = new mongoose.Schema({
  booking_stamp: Date,
  PNR_no: String,
  user_id: { type: mongoose.Types.ObjectId, ref: "user" },
  departure_date: Date,
  return_date: Date,
  class_typ: Number,
  status: Number,
  jouerny_info: {
    departure_city: { type: mongoose.Types.ObjectId, ref: "city" },
    source_city: { type: mongoose.Types.ObjectId, ref: "city" },
    departure_flight: { type: mongoose.Types.ObjectId, ref: "flight" },
    return_flight: { type: mongoose.Types.ObjectId, ref: "flight" },
    peoples: {
      adults: [{ name: String, age: Number, gender: Number, seat_no: String }],
      childrens: [
        { name: String, age: Number, gender: Number, seat_no: String },
      ],
    },
  },
  payment: { type: mongoose.Types.ObjectId, ref: "payment" },
});

export const bookingModel = mongoose.model("booking", BookingSchema);
