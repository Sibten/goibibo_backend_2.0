import e from "express";
import { authenticateUser } from "../middleware/authenticate";
import { roles } from "../helper/enums";
import { addRoute, getRouteDetails } from "../controller/route.controller";

export const routeRouter = e.Router();

// routeRouter.get("/")

routeRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.Admin)
);

routeRouter.post("/addroute", addRoute);
routeRouter.get("/getroutes", getRouteDetails);
