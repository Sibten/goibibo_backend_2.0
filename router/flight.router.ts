import e from "express";
import { authorizedUser } from "../middleware/authorized";
import { roles } from "../helper/enums";
import {
  addBookedSeat,
  getBookingdetailsOfFlight,
  getMyAirlineFlights,
  updateFlight,
} from "../controller/flights.controller";
import {
  scheduleFlight,
  getFlightDetails,
} from "../controller/flights.controller";
import { addFare } from "../controller/fare.controller";

export const flightRouter = e.Router();

flightRouter.get("/get_flight", getFlightDetails);
flightRouter.use((req, res, next) =>
  authorizedUser(req, res, next, roles.Admin)
);

flightRouter.post("/schedule", scheduleFlight);
flightRouter.get("/my_airline_flights", getMyAirlineFlights);
flightRouter.post("/add_booking_data", addBookedSeat);
flightRouter.put("/reschedule", updateFlight);
flightRouter.get("/getbookings", getBookingdetailsOfFlight);
