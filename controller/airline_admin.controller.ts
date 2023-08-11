import mongoose from "mongoose";
import { airlineAdminModel } from "../model/airline_admin.model";
import { Request, Response } from "express";
import { AirlineAdminBase } from "../helper/interfaces";

export const insertAirlineAdmin = async (
  data: AirlineAdminBase,
  res: Response
) => {
  try {
    const newAdmin = new airlineAdminModel(data);
    await newAdmin.save();
    res.status(200).json({ add: 1, message: "Admin added" });
  } catch (e) {
    res.status(200).json({ add: 0, error: 1, error_desc: e });
  }
};

export const getAirlineAdminDetails = async (req: Request, res: Response) => {
  const data = await airlineAdminModel
    .find()
    .populate("user_id")
    .populate("airline_id")
    .exec();
  res.status(200).send(data);
};
