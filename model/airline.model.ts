import mongoose from "mongoose";




const airlineSchema = new mongoose.Schema(
  {
    airline_id: { type: String, required: true },
    airline_name: String,
    airline_location: String,
    airline_code: String,
    airline_icon: String,
  },
  { timestamps: true }
);

export const airlineModel = mongoose.model("airline", airlineSchema);
