import { Request, Response } from "express";
import { Offer } from "../helper/interfaces";
import { offerModel } from "../model/offers.model";

export const createOffer = async (req: Request, res: Response) => {
  const offerData: Offer = {
    offer_name: req.body.offer_name,
    referal_code: req.body.referal_code,
    offer_discount: req.body.offer_discount,
    valid_till: new Date(req.body.valid_till),
    promo: req.query.promo == "true",
    description: req.body.description,
  };

  try {
    if (
      offerData.offer_name != "" &&
      offerData.referal_code != "" &&
      offerData.offer_discount != 0
    ) {
      const newOffer = new offerModel(offerData);
      await newOffer.save();
      res.status(200).json({ add: 1, message: "offer created!" });
    } else throw new Error("Provide required details!");
  } catch (e) {
    res.status(400).json({ add: 0, message: "Error", error: e });
  }
};

export const getAlloffers = async (req: Request, res: Response) => {
  const findOffers = await offerModel
    .find(
      { promo: false, valid_till: { $gte: new Date() } },
      { __v: 0, _id: 0, createdAt: 0, updatedAt: 0, promo: 0 }
    )
    .sort({ valid_till: 1 })
    .exec();

  res.status(200).send(findOffers);
};

export const reedmeOffer = async (req: Request, res: Response) => {
  const findOffer = await offerModel
    .findOne({
      referal_code: req.query.code,
      valid_till: { $gte: new Date() },
      promo: true,
    })
    .exec();

  if (findOffer) {
    res.status(200).json({ reedme: 1, offer: findOffer });
  } else {
    res
      .status(200)
      .json({ reedme: 0, message: "Offer is expried or invalid code" });
  }
};
