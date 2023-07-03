import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userModel } from "../model/user.model";
import { airlineAdminModel } from "../model/airline_admin.model";
import { RuleBase } from "../helper/interfaces";
import { Flightclass } from "../helper/enums";
import { ruleModel } from "../model/rules.model";

export const addRule = async (req: Request, res: Response) => {
  let token: any = req.headers.token;

  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  let findUser = await userModel.findOne({ email: decode.email }).exec();

  const findAirlineId = await airlineAdminModel
    .findOne({
      user_id: findUser?._id,
    })
    .exec();
  const rule: RuleBase = {
    airline_id: findAirlineId?._id ?? null,
    luggage: [
      {
        type: Flightclass.Business,
        limit: req.body.BC,
      },
      {
        type: Flightclass.Economy,
        limit: req.body.EC,
      },
      {
        type: Flightclass.PremiumEconomy,
        limit: req.body.PE,
      },
      {
        type: Flightclass.FirstClass,
        limit: req.body.FC,
      },
    ],
  };

  try {
    const newRule = new ruleModel(rule);
    newRule.save();
    res.status(200).json({ add: 1, message: "rule added!" });
  } catch (e) {
    res.status(400).json({ add: 0, message: "error", error: e });
  }
};
