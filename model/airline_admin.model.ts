import mongoose from "mongoose";

const c = mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => d)
  .catch((e) => e);

const airadminSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
  airline_id: { type: mongoose.Types.ObjectId, required: true, ref: "airline" },
});

export const airlineAdminModel = mongoose.model(
  "airline-admin",
  airadminSchema
);
