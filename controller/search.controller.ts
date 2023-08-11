import { Request, Response } from "express";
import { routeModel } from "../model/route.model";
import { cityModel } from "../model/city.model";
import { ObjectId } from "mongodb";
import { flightModel } from "../model/flight.model";
import { FlightStatus, Flightclass } from "../helper/enums";

const getFlightsOnRoute = async (req: Request, res: Response) => {
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
  let date2: Date;
  if (date.toDateString() == curDate.toDateString()) {
    date = new Date(curDate.setHours(curDate.getHours() + 1));
    date2 = new Date(
      new Date(new Date(curDate).setDate(curDate.getDate() + 1)).setHours(0)
    );
  } else {
    date2 = new Date(
      new Date(new Date(date).setDate(date.getDate() + 1)).setHours(0)
    );
  }

  let data: Object;

  console.log(date, date2);

  try {
    switch (parseInt(req.query.class?.toString()!)) {
      case Flightclass.Business:
        data = await flightModel
          .find(
            {
              route_id: Routes,
              timing: {
                $elemMatch: { source_time: { $gte: date, $lt: date2 } },
              },
              available_seats: {
                $elemMatch: {
                  date: { $gte: date, $lt: date2 },
                  BC: { $gt: req.query.people },
                },
              },
              status: FlightStatus.Schduleded,
            },
            {
              timing: {
                $elemMatch: { source_time: { $gte: date, $lt: date2 } },
              },
              available_seats: 1,
              booked_seats: 1,
              flight_no: 1,
              airbus_id: 1,
              airline_id: 1,
              fare: 1,
              route_id: 1,
              rule: 1,
              status: 1,
            }
          )
          .populate({
            path: "route_id",
            select: "-_id",
            populate: {
              path: "source_city destination_city stops",
              select: "airport_name airport_code city_id city_name -_id",
            },
          })
          .populate({
            path: "airline_id",
            select: "airline_id airline_name airline_icon airline_code -_id",
          })
          .populate({
            path: "fare",
            select: "-fare._id -_id -__v -createdAt -updatedAt",
          })
          .populate({ path: "airbus_id", select: "airbus_code" })
          .populate({
            path: "rule",
            select: " -_id -__v -createdAt -updatedAt",
          })
          .select("-_id -__v -createdAt -updatedAt")
          .sort({ "timing.source_time": 1 })
          .exec();
        break;
      case Flightclass.Economy:
        data = await flightModel
          .find(
            {
              route_id: Routes,
              "timing.source_time": {
                $gte: date,
                $lt: date2,
              },
              available_seats: {
                $elemMatch: {
                  date: { $gte: date, $lt: date2 },
                  EC: { $gt: req.query.people },
                },
              },
              status: FlightStatus.Schduleded,
            },
            {
              timing: {
                $elemMatch: { source_time: { $gte: date, $lt: date2 } },
              },
              available_seats: 1,
              booked_seats: 1,
              flight_no: 1,
              airbus_id: 1,
              airline_id: 1,
              fare: 1,
              route_id: 1,
              rule: 1,
              status: 1,
            }
          )
          .populate({
            path: "route_id",
            select: "-_id -__v",
            populate: {
              path: "source_city destination_city stops",
              select: "airport_name airport_code city_id city_name -_id",
            },
          })
          .populate({
            path: "airline_id",
            select: "airline_id airline_name airline_icon airline_code -_id",
          })
          .populate({
            path: "fare",
            select: "-fare._id -_id -__v -createdAt -updatedAt",
          })
          .populate({ path: "airbus_id", select: "airbus_code" })
          .populate({
            path: "rule",
            select: " -_id -__v -createdAt -updatedAt",
          })
          .select("-_id")
          .sort({ "timing.source_time": 1 })
          .exec();
        break;

      case Flightclass.FirstClass:
        data = await flightModel
          .find(
            {
              route_id: Routes,
              timing: {
                $elemMatch: { source_time: { $gte: date, $lt: date2 } },
              },
              available_seats: {
                $elemMatch: {
                  date: { $gte: date, $lt: date2 },
                  FC: { $gt: req.query.people },
                },
              },
              status: FlightStatus.Schduleded,
            },
            {
              timing: {
                $elemMatch: { source_time: { $gte: date, $lt: date2 } },
              },
              available_seats: 1,
              booked_seats: 1,
              flight_no: 1,
              airbus_id: 1,
              airline_id: 1,
              fare: 1,
              route_id: 1,
              rule: 1,
              status: 1,
            }
          )
          .populate({
            path: "route_id",
            select: "-_id -__v",
            populate: {
              path: "source_city destination_city stops",
              select: "airport_name airport_code city_id city_name -_id",
            },
          })
          .populate({
            path: "airline_id",
            select: "airline_id airline_name airline_icon airline_code -_id",
          })
          .populate({
            path: "fare",
            select: "-fare._id -_id -__v -createdAt -updatedAt",
          })
          .populate({ path: "airbus_id", select: "airbus_code" })
          .populate({
            path: "rule",
            select: " -_id -__v -createdAt -updatedAt",
          })
          .select("-_id -__v -createdAt -updatedAt")
          .sort({ "timing.source_time": 1 })
          .exec();
        break;
      case Flightclass.PremiumEconomy:
        data = await flightModel
          .find(
            {
              route_id: Routes,
              timing: {
                $elemMatch: { source_time: { $gte: date, $lt: date2 } },
              },
              available_seats: {
                $elemMatch: {
                  date: { $gte: date, $lt: date2 },
                  PE: { $gt: req.query.people },
                },
              },
              status: FlightStatus.Schduleded,
            },
            {
              timing: {
                $elemMatch: { source_time: { $gte: date, $lt: date2 } },
              },
              available_seats: 1,
              booked_seats: 1,
              flight_no: 1,
              airbus_id: 1,
              airline_id: 1,
              fare: 1,
              route_id: 1,
              rule: 1,
              status: 1,
            }
          )
          .populate({
            path: "route_id",
            select: "-_id -__v",
            populate: {
              path: "source_city destination_city stops",
              select: "airport_name airport_code city_id city_name -_id",
            },
          })
          .populate({
            path: "airline_id",
            select: "airline_id airline_name airline_icon airline_code -_id",
          })
          .populate({
            path: "fare",
            select: "-fare._id -_id -__v -createdAt -updatedAt",
          })
          .populate({ path: "airbus_id", select: "airbus_code" })
          .populate({
            path: "rule",
            select: " -_id -__v -createdAt -updatedAt",
          })
          .select("-_id -__v -createdAt -updatedAt")
          .sort({ "timing.source_time": 1 })
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
          .populate({ path: "rule" })
          .sort({ "timing.source_time": 1 })
          .exec();
        break;
    }
    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getDepartureFlight = async (req: Request, res: Response) => {
  const data = await getFlightsOnRoute(req, res);
  if (data) res.status(200).json({ dep: data });
  else res.status(500).json({ find: 0, message: data });
};

export const getDepRtnFlight = async (req: Request, res: Response) => {
  const depDate = new Date(req.query.date?.toString()!);
  const rtnDate = new Date(req.query.rtndate?.toString()!);

  if (depDate <= rtnDate) {
    const depData = await getFlightsOnRoute(req, res);

    let temp = req.query.start_point;
    req.query.start_point = req.query.end_point;
    req.query.end_point = temp;
    req.query.date = req.query.rtndate;

    const rtnData = await getFlightsOnRoute(req, res);

    if (depData && rtnData) {
      res.status(200).json({ dep: depData, rtn: rtnData });
    } else {
      res
        .status(500)
        .json({ find: 0, message: { dep: depData, rtn: rtnData } });
    }
  } else {
    res
      .status(400)
      .json({ find: 0, message: "Return date must be greater than dep date" });
  }
};
