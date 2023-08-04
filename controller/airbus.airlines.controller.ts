import { Request, Response } from "express";
import { AirBusBase, ClassMap } from "../helper/interfaces";
import { airbusModel } from "../model/airbus.model";
import { Flightclass } from "../helper/enums";

export const createAirbus = (req: Request, res: Response) => {
  req.body.seat_map.forEach((e: ClassMap) => {
    switch (e.class_type) {
      case Flightclass.Business:
        req.body.Business = true;
        break;
      case Flightclass.Economy:
        req.body.Economy = true;
        break;
      case Flightclass.FirstClass:
        req.body.FirstClass = true;
        break;
      case Flightclass.PremiumEconomy:
        req.body.Premium = true;
        break;
    }
  });

  const airbusData: AirBusBase = {
    airbus_code: req.body.airbus_code,
    available_class: {
      BC: req.body.Business ?? false,
      EC: req.body.Economy ?? false,
      PE: req.body.Premium ?? false,
      FC: req.body.FirstClass ?? false,
    },
    seat_map: req.body.seat_map,
  };

  try {
    if (airbusData.airbus_code != "" && airbusData.seat_map.length > 0) {
      const newAirbus = new airbusModel(airbusData);
      newAirbus.save();
      res.status(200).json({ add: 1, message: "Airbus Created!" });
    } else throw new Error("Data can't be empty!");
  } catch (e) {
    res.status(400).json({ add: 0, message: "Error", error: e });
  }
};

export const getAirbus = async (req: Request, res: Response) => {
  console.log("---");
  try {
    const data = await airbusModel
      .find({}, { __v: 0, _id: 0, "seat_map._id": 0 })
      .exec();
    res.status(200).send(data);
  } catch (e) {
    res.status(400).json({ error: 1, message: e });
  }
};