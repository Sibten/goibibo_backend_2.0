import e from "express";
import { flightRouter } from "../router/flight.router";
import { airbusRouter } from "../router/airbus.router";
import { searchRouter } from "../router/search.router";
import { offerRouter } from "../router/offer.router";
import { addOnRouter } from "../router/addon.router";
import { paymentRouter } from "../router/payment.router";
import { userRouter } from "../router/user.router";
import { cityRouter } from "../router/city.router";
import { roleRouter } from "../router/role.router";
import { airlineRouter } from "../router/airline.router";
import { routeRouter } from "../router/route.router";

export const indexRouter = e.Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/city", cityRouter);
indexRouter.use("/airlines", airlineRouter);
indexRouter.use("/role", roleRouter);
indexRouter.use("/route", routeRouter);
indexRouter.use("/airbus", airbusRouter);
indexRouter.use("/flight", flightRouter);
indexRouter.use("/search", searchRouter);
indexRouter.use("/offers", offerRouter);
indexRouter.use("/addons", addOnRouter);
indexRouter.use("/payment", paymentRouter);
