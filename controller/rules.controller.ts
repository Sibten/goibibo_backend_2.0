import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userModel } from "../model/user.model";
import { airlineAdminModel } from "../model/airline_admin.model";
import { RuleBase } from "../helper/interfaces";
import { AddOnType, Flightclass } from "../helper/enums";
import { ruleModel } from "../model/rules.model";
import mongoose from "mongoose";

export const addRule = async (req: Request, res: Response) => {
  let token: any = req.headers.token;

  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  let findUser = await userModel.findOne({ email: decode.email }).exec();

  if (parseInt(req.query.type as string) == AddOnType.Baggage) {
    const findAirlineId = await airlineAdminModel
      .findOne({
        user_id: findUser?._id,
      })
      .exec();
    const rule: RuleBase = {
      airline_id:
        (findAirlineId?.airline_id as mongoose.Types.ObjectId) ?? null,
      luggage: [
        {
          type: Flightclass.Economy,
          limit: req.body.EC,
        },
        {
          type: Flightclass.PremiumEconomy,
          limit: req.body.PE,
        },
        {
          type: Flightclass.Business,
          limit: req.body.BC,
        },
        {
          type: Flightclass.FirstClass,
          limit: req.body.FC,
        },
      ],
    };

    try {
      await ruleModel
        .updateOne(
          { airline_id: findAirlineId },
          { $set: { airline_id: rule.airline_id, luggage: rule.luggage } },
          { upsert: true }
        )
        .exec();
      res.status(200).json({ add: 1, message: "rule added!" });
    } catch (e) {
      res.status(400).json({ add: 0, message: "error", error: e });
    }
  } else {
    res.status(500).send("not found");
  }
};

export const getRules = async (req: Request, res: Response) => {
  let token: any = req.headers.token;

  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  let findUser = await userModel.findOne({ email: decode.email }).exec();

  const findAirlineId = await airlineAdminModel
    .findOne({
      user_id: findUser?._id,
    })
    .exec();

  const data = await ruleModel
    .findOne(
      { airline_id: findAirlineId?.airline_id },
      { createdAt: 0, updatedAt: 0, __v: 0, _id: 0 }
    )
    .populate({ path: "airline_id", select: "-_id -__v -createdAt -updatedAt" })
    .exec();
  res.status(200).send(data);
};