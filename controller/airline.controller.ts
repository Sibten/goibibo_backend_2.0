import { airlineModel } from "../model/airline.model";
import { Request, Response } from "express";
import { validateAirline } from "../validator/airline.validate";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { userModel } from "../model/user.model";
import { airlineAdminModel } from "../model/airline_admin.model";
import { uploadImage } from "../helper/awsmethods";
import { decodeJWT } from "../helper/decodeJWT";

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

export const getMyAirlinesDetails = async (req: Request, res: Response) => {
  try {

    let findUser = await decodeJWT(req)
    const findAirlineAdmin = await airlineAdminModel
      .findOne({
        user_id: findUser?._id,
      })
      .exec();

    const findAirline = await airlineModel
      .findById(findAirlineAdmin?.airline_id, { _id: 0, __v: 0 })
      .exec();
    res.status(200).send(findAirline);
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
   
      let findUser = await decodeJWT(req)

      const findAirlineAdmin = await airlineAdminModel
        .findOne({
          user_id: findUser?._id,
        })
        .exec();

      const findAirline = await airlineModel
        .findById(findAirlineAdmin?.airline_id, { _id: 0, __v: 0 })
        .exec();
        console.log(findAirline);
        console.log(req.body);

        if (findAirline) {
          const respo = await airlineModel
            .updateOne(
              { airline_id: findAirline.airline_id },
              {
                $set: {
                  airline_id: findAirline.airline_id,
                  airline_name: req.body.airline_name,
                  airline_location: req.body.airline_location,
                  airline_code: findAirline.airline_code,
                },
              }
            )
            .exec();
          res.status(200).send({
            validation: 1,
            update: 1,
            message: "Sucessfully Updated!",
            res: respo,
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

export const updateIcon = async (req: Request, res: Response) => {
  let file: any = Object.assign({}, req.files);

  if (file.file) {
    const fileParams = {
      Bucket: "goibibo-sibten",
      Key: `airlines/${file.file.name.replaceAll(" ", "")}`,
      Body: file.file.data,
      ContentType: file.file.mimetype,
    };

    let url = await uploadImage(fileParams);
    if (url) {

      let findUser = await decodeJWT(req)

      try {
        const findAirlineAdmin = await airlineAdminModel
          .findOne({
            user_id: findUser?._id,
          })
          .exec();

        const findAirline = await airlineModel
          .findById(findAirlineAdmin?.airline_id)
          .exec();

        await airlineModel
          .findByIdAndUpdate(findAirline?._id, {
            $set: { airline_icon: url },
          })
          .exec();

        res.status(200).json({ update: 1, message: "Icon Updated!" });
      } catch (e) {
        res
          .status(400)
          .json({ update: 0, message: "Unable to update", Error: e });
      }
    } else {
      res.status(400).json({ update: 0, message: "Unable to generate URL" });
    }
  } else {
    res.status(400).json({ update: 0, message: "Unable to update" });
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
