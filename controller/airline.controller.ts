import { airlineModel } from "../model/airline.model";
import { Request, Response } from "express";
import { validateAirline } from "../validator/airline.validate";

export const getAirlines = async (req: Request, res: Response) => {
  try {
    let findAirlines = await airlineModel.find({}).exec();
    res.status(200).send(findAirlines);
  } catch (e) {
    res.status(500).json({
      error: 1,
      error_desc: e,
    });
  }
};

export const addAirline = async (req: Request, res: Response) => {
  let valid = validateAirline(req.body);
  if (!valid["error"]) {
    try {
      let findAirline = await airlineModel
        .findOne({
          airline_name: req.body.airline_name,
          airline_code: req.body.airline_code,
        })
        .exec();
      if (!findAirline) {
        const newairline = new airlineModel(req.body);
        await newairline.save();
        res.status(201).json({
          added: 1,
          verfied: 1,
          message: "new airline added!",
        });
      } else {
        res.status(400).json({
          verfied: 1,
          message: "Unable to add due to airline or code already present!",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: 1,
        validation: 1,
        error_desc: e,
      });
    }
  } else {
    res.status(400).json({
      validation: 0,
      messsage: "validation error",
      error_desc: valid["error"],
    });
  }
};

export const updateAirline = async (req: Request, res: Response) => {
  let valid = validateAirline(req.body);
  if (!valid["error"]) {
    try {
      let findAirline = await airlineModel
        .findOne({ airline_name: req.body.airline_name })
        .exec();
      if (findAirline) {
        await airlineModel
          .updateOne(
            { airline_name: req.body.airline_name },
            { $set: req.body }
          )
          .exec();
        res.status(200).send({
          validation: 1,
          update: 1,
          message: "Sucessfully Updated!",
        });
      } else {
        res.status(400).json({
          validation: 1,
          find: 0,
          update: 0,
          message: "Unable to Update due to airline not found!",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: 1,
        update: 0,
        validation: 1,
        error_desc: e,
      });
    }
  } else {
    res.status(400).json({
      erro: 1,
      validation: 0,
      update: 0,
      messsage: "validation error",
      error_desc: valid["error"],
    });
  }
};

export const deleteAirline = async (req: Request, res: Response) => {
  try {
    let findAirline = await airlineModel
      .findOne({ airline_name: req.body.airline_name })
      .exec();
    if (findAirline) {
      await airlineModel
        .findOneAndRemove({
          airline_name: req.body.airline_name,
        })
        .exec();
      res.status(200).send({
        delete: 1,
        message: "Sucessfully deleted!",
      });
    } else {
      res.status(400).json({
        find: 0,
        delete: 0,
        message: "Unable to Delete due to airline not found!",
      });
    }
  } catch (e) {
    res.status(500).json({
      error: 1,
      delete: 0,
      error_desc: e,
    });
  }
};
