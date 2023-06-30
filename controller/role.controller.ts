import { roleModel } from "../model/roles.model";
import { validateRole } from "../validator/role.validate";
import { Request, Response } from "express";

export const addRole = async (req: Request, res: Response) => {
  let valid = validateRole(req.body);
  if (!valid["error"]) {
    let newRole = new roleModel(req.body);
    await newRole.save();
    res.status(201).json({
      success: 1,
      message: "Role added!",
    });
  } else {
    res.status(400).json({
      sucess: 0,
      error: 1,
      message: "Validation Error!",
      error_desc: valid["error"],
    });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  let findRole = await roleModel.findOne({ role_id: req.body.role_id }).exec();
  if (findRole) {
    await roleModel.deleteOne({ role_id: req.body.role_id }).exec();
    res.status(200).json({ sucess: 1, message: "Role Deleted!" });
  } else {
    res.status(200).json({ sucess: 0, message: "Role not found!" });
  }
};


