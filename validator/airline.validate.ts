import Joi from "joi";
import { Schema } from "mongoose";

export const validateAirline = (airlinedata: Schema) => {
  const valid = Joi.object({
    airline_id: Joi.string(),
    airline_name: Joi.string(),
    airline_location: Joi.string(),
    airline_code: Joi.string().min(2).max(4),
  });
  return valid.validate(airlinedata);
};
