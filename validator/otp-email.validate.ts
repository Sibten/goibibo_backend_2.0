import Joi from "joi";
import { Schema } from "mongoose";

export const validateEmail = (data: Schema) => {
  const emailSchema = Joi.object({
    email: Joi.string().regex(/^[A-Za-z0-9\-._]+@([A-Za-z0-9-]+\.)+[a-z]{2,}$/),
  });
  return emailSchema.validate(data);
};
