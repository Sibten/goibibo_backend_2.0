import { Request, Response } from "express";
import { routeModel } from "../model/route.model";
import { cityModel } from "../model/city.model";
import { ObjectId } from "mongodb";
import { flightModel } from "../model/flight.model";
import { Flightclass } from "../helper/enums";

export const getFlightsOnRoute = async (req: Request, res: Response) => {
  const startPoint = await cityModel
    .findOne({ airport_code: req.query.start_point })
    .exec();

  const endPoint = await cityModel
    .findOne({
      airport_code: req.query.end_point,
    })
    .exec();
  const Routes: Array<ObjectId> = [];

  const findRoute = await routeModel
    .find({ source_city: startPoint?._id, destination_city: endPoint?._id })
    .exec();

  findRoute.forEach((r) => {
    Routes.push(r._id);
  });
  const curDate: Date = new Date();
  let date: Date = new Date(req.query.date?.toString()!);
  if (date.toDateString() == curDate.toDateString()) {
    date = curDate;
  }
  const date2: Date = new Date(new Date(date).setDate(date.getDate() + 1));
  let data: Object;
  switch (parseInt(req.query.class?.toString()!)) {
    case Flightclass.Business:
      data = await flightModel
        .find({
          route_id: Routes,
          "timing.source_time": { $gte: date, $lt: date2 },
          "available_seats.BC": { $gte: req.query.people },
        })
        .populate({
          path: "route_id",
          populate: "source_city destination_city",
        })
        .populate({ path: "airline_id" })
        .exec();
      break;
    case Flightclass.Economy:
      data = await flightModel
        .find({
          route_id: Routes,
          "timing.source_time": { $gte: date, $lt: date2 },
          "available_seats.EC": { $gte: req.query.people },
        })
        .populate({
          path: "route_id",
          populate: "source_city destination_city",
        })
        .populate({ path: "airline_id" })
        .exec();
      break;

    case Flightclass.FirstClass:
      data = await flightModel
        .find({
          route_id: Routes,
          "timing.source_time": { $gte: date, $lt: date2 },
          "available_seats.FC": { $gte: req.query.people },
        })
        .populate({
          path: "route_id",
          populate: "source_city destination_city",
        })
        .populate({ path: "airline_id" })
        .exec();
      break;
    case Flightclass.PremiumEconomy:
      data = await flightModel
        .find({
          route_id: Routes,
          "timing.source_time": { $gte: date, $lt: date2 },
          "available_seats.PE": { $gte: req.query.people },
        })
        .populate({
          path: "route_id",
          populate: "source_city destination_city",
        })
        .populate({ path: "airline_id" })
        .exec();
      break;
    default:
      data = await flightModel
        .find({
          route_id: Routes,
          "timing.source_time": { $gte: date, $lt: date2 },
        })
        .populate({
          path: "route_id",
          populate: "source_city destination_city",
        })
        .populate({ path: "airline_id" })
        .exec();
      break;
  }

  res.status(200).send(data);
};
