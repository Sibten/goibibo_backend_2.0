import e from "express";
import { authorizedUser } from "../middleware/authorized";
import { roles } from "../helper/enums";
import { addRoute, getRouteDetails } from "../controller/route.controller";

export const routeRouter = e.Router();

routeRouter.use((req, res, next) =>
  authorizedUser(req, res, next, roles.Admin)
);

routeRouter.post("/addroute", addRoute);
routeRouter.get("/getroutes", getRouteDetails);
