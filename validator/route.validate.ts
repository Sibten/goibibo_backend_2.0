import Joi, { string } from "joi";
import { Schema } from "mongoose";

export const validateRoute = (data: Schema) => {
  const validate = Joi.object({
    route_id: Joi.string().required(),
    source_city: Joi.string().required(),
    destination_city: Joi.string().required(),
    total_km: Joi.string().optional(),
    stops: Joi.array().optional(),
  });

  return validate.validate(data);
};
