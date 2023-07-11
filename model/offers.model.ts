import { connectDB } from "./Service/ConnectDB.services";
import mongoose from "mongoose";

connectDB();

const offerSchema = new mongoose.Schema({
  offer_name: String,
  offer_discount: Number,
});
