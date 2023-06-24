import Joi from "joi";
import { Schema } from "mongoose";

export const validateUser = (user: Schema) => {
  const userSchema = Joi.object({
    profile_photo: Joi.string().uri().allow("").optional(),
    role: Joi.string(),
    user_name: Joi.string().optional(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    email: Joi.string()
      .regex(/[A-Za-z0-9._-]+@[a-z0-9.]+.[a-z]{2,4}/)
      .optional(),
    password: Joi.string()
      .regex(/^.*(?=.{8,16})(?=.*[a-zA-Z])(?=.*\d)(?=.*[@-_!#$%"']).*$/)
      .optional(),
    gender: Joi.string().optional(),
    date_of_birth: Joi.date().optional(),
    billing_address: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    pincode: Joi.number(),
    otp: Joi.string().optional(),
  });
  return userSchema.validate(user);
};
