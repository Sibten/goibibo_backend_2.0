import e from "express";
import { getCities, addCities } from "../controller/city.controller";
import { authorizedUser } from "../middleware/authorized";
import { roles } from "../helper/enums";

export const cityRouter = e.Router();

cityRouter.get("/", getCities);
cityRouter.use((req, res, next) =>
  authorizedUser(req, res, next, roles.SuperAdmin)
);
cityRouter.post("/addCities", addCities);
