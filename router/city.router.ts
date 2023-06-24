import e from "express";
import { getCities, addCities } from "../controller/city.controller";
import { authenticateUser } from "../middleware/authenticate";
import { roles } from "../helper/enums";

export const cityRouter = e.Router();

cityRouter.get("/", getCities);
cityRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.SuperAdmin)
);
cityRouter.post("/addCities", addCities);
