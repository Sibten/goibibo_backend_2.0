import e from "express";
import { authenticateUser } from "../middleware/authenticate";
import {
  addAirline,
  getAirlines,
  updateAirline,
  deleteAirline,
} from "../controller/airline.controller";
import { roles } from "../helper/enums";
export const airlineRouter = e.Router();

airlineRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.SuperAdmin)
);
airlineRouter.get("/getAirlines", getAirlines);
airlineRouter.post("/addAirline", addAirline);
airlineRouter.put("/updateAirline", updateAirline);
airlineRouter.delete("/removeAirline", deleteAirline);
