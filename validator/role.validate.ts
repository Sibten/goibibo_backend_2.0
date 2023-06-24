import Joi from "joi";
import { Schema } from "mongoose";

export const validateRole = (roledata: Schema) => {
  const valid = Joi.object({
    role_name: Joi.string().valid("Admin").valid("SuperAdmin").valid("User"),
    role_id: Joi.number(),
  });
  return valid.validate(roledata);
};
