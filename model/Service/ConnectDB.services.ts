import mongoose from "mongoose";
export const connectDB = () => {
  try {
    const mongo_url = process.env.MONGO_URL ?? "/";
    console.log(mongo_url);
    mongoose
      .connect(mongo_url)
      .then((d) => console.log("Database is connected..."))
      .catch((e) => console.log("unable to connect", e));
  } catch (e) {
    console.log("unable to connect");
  }
};
