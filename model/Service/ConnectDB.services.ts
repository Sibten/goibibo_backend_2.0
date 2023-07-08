import mongoose from "mongoose";
export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/goibibo")
    .then((d) => d)
    .catch((e) => e);
};
