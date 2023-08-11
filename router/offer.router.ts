import e from "express";
import { authorizedUser } from "../middleware/authorized";
import { roles } from "../helper/enums";
import {
  createOffer,
  getAlloffers,
  reedmeOffer,
} from "../controller/offer.controller";
import { NextFunction, Request, Response } from "express-serve-static-core";

export const offerRouter = e.Router();

offerRouter.get("/all_offers", getAlloffers);
offerRouter.get(
  "/reedme",
  (req: Request, res: Response, next: NextFunction) =>
    authorizedUser(req, res, next, roles.User),
  reedmeOffer
);

offerRouter.post(
  "/add",
  (req, res, next) => authorizedUser(req, res, next, roles.SuperAdmin),
  createOffer
);
