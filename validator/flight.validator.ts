import Joi from "joi";
import { FlightScheduleData } from "../helper/interfaces";

export const validateFlight = (data: FlightScheduleData) => {
  const flightSchema = Joi.object({
    source_time: Joi.date(),
    destination_time: Joi.date(),
  });

  return flightSchema.validate(data);
};
