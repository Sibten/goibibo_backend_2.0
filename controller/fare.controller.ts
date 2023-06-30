import { Request, Response } from "express";
import { FareBase } from "../helper/interfaces";

import { airlineAdminModel } from "../model/airline_admin.model";
import { userModel } from "../model/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Flightclass } from "../helper/enums";
import { fareModel } from "../model/fare.model";

export const addFare = async (req: Request, res: Response) => {
  let token: any = req.headers.token;

  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  let findUser = await userModel.findOne({ email: decode.email }).exec();

  const findAirlineId = await airlineAdminModel
    .findOne({
      user_id: findUser?._id,
    })
    .exec();

  const fareData: FareBase = {
    airline_id: findAirlineId?._id ?? null,
    fare: [
      { class_type: Flightclass.Economy, basic_fare: req.body.EC_fare },
      { class_type: Flightclass.PremiumEconomy, basic_fare: req.body.PE_fare },
      { class_type: Flightclass.Business, basic_fare: req.body.BC_fare },
      { class_type: Flightclass.FirstClass, basic_fare: req.body.FC_fare },
    ],
    tax: req.body.tax,
  };
  try {
    const newFare = new fareModel(fareData);
    await newFare.save();
    res.status(200).json({ add: 1, message: "fare added!" });
  } catch (e) {
    res.status(400).json({ add: 0, message: "error", error: e });
  }
};