import { Request, Response } from "express";
import { cityModel } from "../model/city.model";

export const addCities = async (req: Request, res: Response) => {
  let data = req.body;
  await cityModel.insertMany(data);
  res.status(400).json({
    add: 1,
    message: "cities added",
  });
};

export const getCities = async (req: Request, res: Response) => {
  let data = await cityModel.find({}, { _id: 0, __v: 0 }).exec();
  res.status(200).send(data);
};
