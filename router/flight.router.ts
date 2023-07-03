import e from "express";
import { authenticateUser } from "../middleware/authenticate";
import { roles } from "../helper/enums";
import { getMyAirlineFlights } from "../controller/flights.controller";
import {
  scheduleFlight,
  getFlightDetails,
} from "../controller/flights.controller";
import { addFare } from "../controller/fare.controller";

export const flightRouter = e.Router();

flightRouter.get("/get_flight", getFlightDetails);
flightRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.Admin)
);

flightRouter.post("/schedule", scheduleFlight);
flightRouter.get("/my_airline_flights", getMyAirlineFlights);

