import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    booking_stamp: Date,
    PNR_no: Number,
    user_id: { type: mongoose.Types.ObjectId, ref: "user" },
    class_type: Number,
    ticket_email: String,
    status: Number,
    jouerny_info: {
      departure_date: Date,
      return_date: Date,
      destination_city: { type: mongoose.Types.ObjectId, ref: "city" },
      source_city: { type: mongoose.Types.ObjectId, ref: "city" },
      departure_flight: { type: mongoose.Types.ObjectId, ref: "flight" },
      return_flight: { type: mongoose.Types.ObjectId, ref: "flight" },
      peoples: [],
      address: String,
      pincode: Number,
      state: String,
      infants: [],
    },
    addons: {
      departure_addons: [],
      return_addons: [],
    },
    payment: { type: mongoose.Types.ObjectId, ref: "payment" },
  },
  { timestamps: true }
);

export const bookingModel = mongoose.model("booking", BookingSchema);
