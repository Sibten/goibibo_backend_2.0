import express from "express";
import env from "dotenv";
import cors from "cors";
import { userRouter } from "./router/user.router";
import { cityRouter } from "./router/city.router";
import { roleRouter } from "./router/role.router";
import { airlineRouter } from "./router/airline.router";
import { routeRouter } from "./router/route.router";
import fileupload from "express-fileupload";

const app = express();
env.config();

const port = process.env.PORT ?? 5050;
app.use(cors());
app.use(fileupload());
app.use(express.json());

app.use("/user", userRouter);
app.use("/city", cityRouter);

app.use("/airlines", airlineRouter);
app.use("/role", roleRouter);
app.use("/route", routeRouter);
app.listen(port, () => console.log(`server is listening at ${port}`));
