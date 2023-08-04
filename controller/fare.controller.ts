import { Request, Response } from "express";
import { FareBase } from "../helper/interfaces";

import { airlineAdminModel } from "../model/airline_admin.model";
import { userModel } from "../model/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Flightclass } from "../helper/enums";
import { fareModel } from "../model/fare.model";
import mongoose from "mongoose";

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
    airline_id: (findAirlineId?.airline_id as mongoose.Types.ObjectId) ?? null,
    fare: [
      { class_type: Flightclass.Economy, basic_fare: req.body.EC_fare ?? 0 },
      {
        class_type: Flightclass.PremiumEconomy,
        basic_fare: req.body.PE_fare ?? 0,
      },
      { class_type: Flightclass.Business, basic_fare: req.body.BC_fare ?? 0 },
      { class_type: Flightclass.FirstClass, basic_fare: req.body.FC_fare ?? 0 },
    ],
    tax: req.body.tax,
  };

  try {
    if (fareData.tax > 0) {
      const data = await fareModel
        .updateOne(
          { airline_id: fareData.airline_id },
          {
            $set: {
              airline_id: fareData.airline_id,
              fare: fareData.fare,
              tax: fareData.tax,
            },
          },
          { upsert: true }
        )
        .exec();
      res.status(200).json({ add: 1, message: "fare added!", data: data });
    } else throw new Error("Tax can't be empty!");
  } catch (e) {
    res.status(400).json({ add: 0, message: "error", error: e });
  }
};

export const getMyAirlineFare = async (req: Request, res: Response) => {
  let token: any = req.headers.token;

  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  let findUser = await userModel.findOne({ email: decode.email }).exec();
  const findAirlineId = await airlineAdminModel
    .findOne({
      user_id: findUser?._id,
    })
    .exec();
  const data = await fareModel
    .findOne(
      { airline_id: findAirlineId?.airline_id },
      { __v: 0, _id: 0, createdAt: 0, updatedAt: 0 }
    )
    .populate({
      path: "airline_id",
      select: "-_id -__v -createdAt -updatedAt",
    })
    .exec();
  // console.log(data);
  res.status(200).send(data);
};