import mongoose from "mongoose";
export const connectDB = () => {
  try {
    const mongo_url = process.env.MONGO_URL ?? "/";
    mongoose
      .connect(mongo_url)
      .then((d) => d)
      .catch((e) => console.log("unable to connect"));
  } catch (e) {
    console.log("unable to connect");
  }
};
