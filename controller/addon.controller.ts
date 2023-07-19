import { Request, Response } from "express";
import { AddOn } from "../helper/interfaces";
import { addonModel } from "../model/addons.model";

export const getAddOns = async (req: Request, res: Response) => {
  try {
    const data = await addonModel
      .find(
        {},
        {
          __v: 0,
        }
      )
      .exec();
    res.status(200).send(data);
  } catch (e) {
    res.status(400).json({ find: 0, message: "Error", error: e });
  }
};

export const add_Addons = async (req: Request, res: Response) => {
  const addOn: AddOn = {
    name: req.body.name,
    type: parseInt(req.body.type),
    icon: req.body.icon ?? undefined,
    limit: parseInt(req.body.limit) ?? undefined,
    price: parseInt(req.body.price),
  };

  try {
    const newAddOn = new addonModel(addOn);
    await newAddOn.save();
    res.status(200).json({ add: 1, message: "Addons Created!" });
  } catch (e) {
    res.status(400).json({ add: 0, message: "Error", error: e });
  }
};
