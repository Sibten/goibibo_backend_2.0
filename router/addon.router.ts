import e from "express";
import { add_Addons, getAddOns } from "../controller/addon.controller";
import { authorizedUser } from "../middleware/authorized";
import { roles } from "../helper/enums";

export const addOnRouter = e.Router();

addOnRouter.get("/", getAddOns);

addOnRouter.use((req, res, next) =>
  authorizedUser(req, res, next, roles.SuperAdmin)
);
addOnRouter.post("/add", add_Addons);
