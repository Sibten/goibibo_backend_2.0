import e from "express";
import { authenticateUser } from "../middleware/authenticate";
import { roles } from "../helper/enums";
import {
  scheduleFlight,
  getFlightDetails,
} from "../controller/flights.controller";

export const flightRouter = e.Router();

flightRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.Admin)
);

flightRouter.post("/schedule", scheduleFlight);
flightRouter.get("/get_flight", getFlightDetails);
