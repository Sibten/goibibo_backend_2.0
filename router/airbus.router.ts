import e from "express";
import { createAirbus } from "../controller/airbus.airlines.controller";
import { authenticateUser } from "../middleware/authenticate";
import { roles } from "../helper/enums";

export const airbusRouter = e.Router();

airbusRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.SuperAdmin)
);
airbusRouter.post("/add", createAirbus);
