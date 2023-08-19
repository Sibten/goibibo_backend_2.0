import { NextFunction, Request, Response } from "express";
import { validateFlight } from "../validator/flight.validator";
import { FlightScheduleData } from "../helper/interfaces";

export const validateFlightMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const incomingObject: FlightScheduleData = {
    source_time: req.body.source_time,
    destination_time: req.body.destination_time,
  };

  const status = validateFlight(incomingObject);

  if (status.error) {
    res
      .status(400)
      .json({ add: 0, message: "validation error!", desc: status.error });
  } else {
    next();
  }
};
