import mongoose from "mongoose";




const airadminSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    airline_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "airline",
    },
  },
  { timestamps: true }
);

export const airlineAdminModel = mongoose.model(
  "airline-admin",
  airadminSchema
);
