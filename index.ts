import express from "express";
import env from "dotenv";
import cors from "cors";
import fileupload from "express-fileupload";
import cookieParser from "cookie-parser";
import { connectDB } from "./model/Service/ConnectDB.services";

const app = express();
env.config();

connectDB();

const port = process.env.PORT ?? 5050;
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://192.168.102.29:3000"],
  })
);
app.use(fileupload());
app.use(cookieParser());
app.use(express.json());

app.listen(port, () => console.log(`server is listening at ${port}`));
