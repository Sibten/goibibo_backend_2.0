import { airlineAdminModel } from "../model/airline_admin.model";
import { Request, Response } from "express";
import { userModel } from "../model/user.model";
import { roles } from "../helper/enums";
import { roleModel } from "../model/roles.model";

export const insertAirlineAdmin = async (req: Request, res: Response) => {
  try {
    const admindetails = await roleModel
      .findOne({ role_id: roles.Admin })
      .exec();

    await userModel
      .findByIdAndUpdate(req.body.user_id, {
        $set: { role: admindetails?._id },
      })
      .exec();

    const newAdmin = new airlineAdminModel(req.body);
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
