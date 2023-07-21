import e from "express";
import { authenticateUser } from "../middleware/authenticate";
import {
  addAirline,
  getAirlines,
  updateAirline,
  deleteAirline,
  getMyAirlinesDetails,
  updateIcon,
} from "../controller/airline.controller";
import { roles } from "../helper/enums";
import { addRule } from "../controller/rules.controller";
import { addFare } from "../controller/fare.controller";
export const airlineRouter = e.Router();

airlineRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.Admin)
);
airlineRouter.get("/myairline/getdetails", getMyAirlinesDetails);
airlineRouter.post("/myairline/add_rule", addRule);
airlineRouter.post("/myairline/fare/add", addFare);
airlineRouter.put("/myairline/update", updateAirline);
airlineRouter.patch("/myairline/update/uploadicon", updateIcon);

airlineRouter.delete("/removeAirline", deleteAirline);

airlineRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.SuperAdmin)
);
airlineRouter.get("/getAirlines", getAirlines);
airlineRouter.post("/addAirline", addAirline);
