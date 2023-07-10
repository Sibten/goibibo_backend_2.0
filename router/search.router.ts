import e from "express";
import {
  getDepRtnFlight,
  getDepartureFlight,
} from "../controller/search.controller";

export const searchRouter = e.Router();

searchRouter.get("/get_dep_flights", getDepartureFlight);
searchRouter.get("/get_dep_rtn_flights", getDepRtnFlight);
