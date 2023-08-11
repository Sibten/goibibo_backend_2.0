import e from "express";
import {
  createAirbus,
  getAirbus,
} from "../controller/airbus.airlines.controller";
import { authorizedUser } from "../middleware/authorized";
import { roles } from "../helper/enums";

export const airbusRouter = e.Router();

airbusRouter.use((req, res, next) =>
  authorizedUser(req, res, next, roles.Admin)
);
airbusRouter.post("/add", createAirbus);
airbusRouter.get("/", getAirbus);