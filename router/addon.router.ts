import e from "express";
import { add_Addons, getAddOns } from "../controller/addon.controller";
import { authenticateUser } from "../middleware/authenticate";
import { roles } from "../helper/enums";

export const addOnRouter = e.Router();

addOnRouter.get("/", getAddOns);

addOnRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.SuperAdmin)
);
addOnRouter.post("/add", add_Addons);
