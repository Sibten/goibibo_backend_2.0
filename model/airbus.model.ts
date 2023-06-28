import mongoose from "mongoose";

const c = mongoose
  .connect("mongodb://localhost:27017/goibibo")
  .then((d) => d)
  .catch((e) => e);

const airbusSchema = new mongoose.Schema({
  airbus_code: String,
  available_class: { BC: Boolean, EC: Boolean, PE: Boolean, FC: Boolean },
  seat_map: [
    {
      class_type: Number,
      row_start: Number,
      row_end: Number,
      col_start: String,
      col_gap: String,
      col_end: String,
    },
  ],
});

export const airbusModel = mongoose.model("airbus", airbusSchema);
