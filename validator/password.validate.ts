import Joi from "joi";
import { Schema } from "mongoose";

export const validatePassword = (data: Schema) => {
  const schema = Joi.object({
    email: Joi.string().regex(/[A-Za-z0-9._-]+@[a-z0-9.]+.[a-z]{2,4}/),
    password: Joi.string()
      .regex(/^.*(?=.{8,16})(?=.*[a-zA-Z])(?=.*\d)(?=.*[@-_!#$%"']).*$/)
      .optional(),
  });

  return schema.validate(data);
};
