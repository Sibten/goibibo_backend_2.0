import express from "express";
import env from "dotenv";
import cors from "cors";
import { userRouter } from "./router/user.router";
import { cityRouter } from "./router/city.router";
import { roleRouter } from "./router/role.router";
import { airlineRouter } from "./router/airline.router";
import { routeRouter } from "./router/route.router";
import fileupload from "express-fileupload";
import { flightRouter } from "./router/flight.router";
import { airbusRouter } from "./router/airbus.router";
import { searchRouter } from "./router/search.router";
import { offerRouter } from "./router/offer.router";

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
app.use("/airbus", airbusRouter);
app.use("/flight", flightRouter);
app.use("/search", searchRouter);
app.use("/offers", offerRouter);
app.listen(port, () => console.log(`server is listening at ${port}`));
