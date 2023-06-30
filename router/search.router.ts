import e from "express";
import { getFlightsOnRoute } from "../controller/search.controller";

export const searchRouter = e.Router();

searchRouter.get("/get_flights", getFlightsOnRoute);
