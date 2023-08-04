import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { userModel } from "../model/user.model";
import { airlineAdminModel } from "../model/airline_admin.model";
import {
  ClassMap,
  FlightBase,
  SeatAvalibility,
  BookedSeats,
  Timing,
  SeatBase,
} from "../helper/interfaces";
import { routeModel } from "../model/route.model";
import { Flightclass, FlightStatus } from "../helper/enums";
import { flightModel } from "../model/flight.model";
import { airbusModel } from "../model/airbus.model";
import { airlineModel } from "../model/airline.model";
import { fareModel } from "../model/fare.model";
import { ruleModel } from "../model/rules.model";

export const scheduleFlight = async (req: Request, res: Response) => {
  let sourceTime = req.body.source_time;
  let destinationTime = req.body.destination_time;

  try {
    sourceTime = new Date(sourceTime);
    destinationTime = new Date(destinationTime);
  } catch (e) {
    res.status(400).json({ error: 1, message: "Bad date request!" });
  }
  const token: any = req.cookies.token;
  const decode: JwtPayload = <JwtPayload>jwt.decode(token);

  const findUser = await userModel.findOne({ email: decode.email }).exec();

  const findAirline = await airlineAdminModel
    .findOne({ user_id: findUser?._id })
    .exec();

  const findAirlineDetails = await airlineModel
    .findById(findAirline?.airline_id)
    .exec();

  const findRoute = await routeModel
    .findOne({ route_id: req.body.route_id })
    .exec();

  const findAirbus = await airbusModel
    .findOne({
      airbus_code: req.body.airbus_code,
    })
    .exec();

  // console.log(findAirbus)

  const ScheduleDate: Date = new Date(req.body.source_time);

  const seat_avliable: SeatAvalibility = {
    date: ScheduleDate,
    BC: 0,
    EC: 0,
    PE: 0,
    FC: 0,
  };

  findAirbus?.seat_map!.forEach((s: ClassMap) => {
    let seats =
      (s.row_end! - s.row_start! + 1) *
      (s.col_end!.charCodeAt(0) - s.col_start!.charCodeAt(0));
    switch (s.class_type) {
      case Flightclass.Business:
        seat_avliable.BC = seats;
        break;
      case Flightclass.Economy:
        seat_avliable.EC = seats;
        break;
      case Flightclass.FirstClass:
        seat_avliable.FC = seats;
        break;
      case Flightclass.PremiumEconomy:
        seat_avliable.PE = seats;
        break;
    }
  });

  const bookedSeat: BookedSeats = {
    date: ScheduleDate,
    EC: [],
    BC: [],
    PE: [],
    FC: [],
  };

  const timing: Timing = {
    source_time: ScheduleDate,
    destination_time: new Date(req.body.destination_time),
  };

  const findFare = await fareModel
    .findOne({ airline_id: findAirlineDetails?._id })
    .exec();

  const findRule = await ruleModel
    .findOne({ airline_id: findAirlineDetails?._id })
    .exec();

  const findAdminAirline = await airlineModel
    .findOne({ airline_code: process.env.ADMN_CODE ?? "ADMN" })
    .exec();

  if (
    sourceTime < destinationTime &&
    findRoute &&
    (JSON.stringify(findRoute?.added_by) ==
      JSON.stringify(findAirlineDetails?._id) ||
      JSON.stringify(findRoute?.added_by) ==
        JSON.stringify(findAdminAirline?._id)) &&
    findAirline &&
    findUser &&
    findAirbus &&
    findRule
  ) {
    const FlightData: FlightBase = {
      flight_no: `${findAirlineDetails?.airline_code}-${
        findRoute.route_id?.split("-")[1]
      }${findAirbus.airbus_code?.toString().replace("-", "")}`,
      airline_id: findAirlineDetails?._id ?? null,
      route_id: findRoute._id ?? null,
      airbus_id: findAirbus?._id ?? null,
      fare: findFare?._id ?? null,
      status: FlightStatus.Schduleded,
      rule: findRule?._id ?? null,
    };
    console.log(FlightData);
    try {
      await flightModel
        .updateOne(
          { flight_no: FlightData.flight_no },
          {
            $push: {
              timing: timing,
              available_seats: seat_avliable,
              booked_seats: bookedSeat,
            },
            $set: {
              flight_no: FlightData.flight_no,
              airline_id: FlightData.airline_id,
              route_id: FlightData.route_id,
              airbus_id: FlightData.airbus_id,
              fare: FlightData.fare,
              status: FlightData.status,
              rule: FlightData.rule,
            },
          },
          {
            upsert: true,
            timestamps: true,
          }
        )
        .exec();
      res.status(200).json({ add: 1, message: "Flight Schedulded!" });
    } catch (e) {
      res.status(400).json({ add: 0, message: "error", error: e });
    }
  } else
    res.status(400).json({
      add: 0,
      message:
        "Bad Request! Check Source time or Destination time, Route, Airbus, fare etc.",
    });
};

export const getFlightDetails = async (req: Request, res: Response) => {
  const data = await flightModel
    .findOne({
      flight_no: req.query.flightno,
    })
    .populate({
      path: "route_id",
      select: "-_id -__v",
      populate: {
        path: "source_city destination_city stops",
        select: "airport_name airport_code city_id city_name -_id ",
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
    .populate({ path: "airbus_id", select: "-_id -__v -createdAt -updatedAt" })
    .populate({
      path: "rule",
      select: " -_id -__v -createdAt -updatedAt",
    })
    .select("-_id -__v -createdAt -updatedAt")
    .exec();

  res.status(200).send(data);
};

export const getMyAirlineFlights = async (req: Request, res: Response) => {
  let token: any = req.cookies.token;
  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  let findUser = await userModel.findOne({ email: decode.email }).exec();

  const findAirlineId = await airlineAdminModel
    .findOne({
      user_id: findUser?._id,
    })
    .exec();
  const data = await flightModel
    .find({ airline_id: findAirlineId?.airline_id })
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
  res.status(200).send(data);
};

export const addBookedSeat = async (req: Request, res: Response) => {
  const findFlight = await flightModel
    .findOne({
      flight_no: req.body.flight_no,
    })
    .exec();

  const avaliable_seat = findFlight?.available_seats.find(
    (s) =>
      s.date?.toDateString() == new Date(req.body.travel_date).toDateString()
  );

  const booked_seat = findFlight?.booked_seats.find(
    (s) =>
      s.date?.toDateString() == new Date(req.body.travel_date).toDateString()
  );

  let seats: Array<string> = [];

  const seatData: Array<SeatBase> = req.body.booking_seat;

  seatData?.forEach((s) => seats.push(s.seat_no));

  try {
    switch (req.body.travel_class) {
      case Flightclass.Business:
        seats.forEach((s) => {
          if (booked_seat?.BC.includes(s)) {
            throw new Error("Seat already booked");
          }
        });

        await flightModel
        .findOneAndUpdate(
          {
            flight_no: req.body.flight_no,
            "booked_seats.date": req.body.travel_date,
          },
          {
            $set: {
              "available_seats.$.BC": avaliable_seat?.BC! - seats.length,
            },
            $push: { "booked_seats.$.BC": { $each: seats } },
          }
        )
        .exec();

        break;
      case Flightclass.Economy:
        seats.forEach((s) => {
          if (booked_seat?.EC.includes(s)) {
            throw new Error("Seat already booked");
          }
        });
        await flightModel
          .findOneAndUpdate(
            {
              flight_no: req.body.flight_no,
              "booked_seats.date": req.body.travel_date,
            },
            {
              $set: {
                "available_seats.$.EC": avaliable_seat?.EC! - seats.length,
              },
              $push: { "booked_seats.$.EC": { $each: seats } },
            }
          )
          .exec();

        break;
      case Flightclass.FirstClass:
        seats.forEach((s) => {
          if (booked_seat?.FC.includes(s)) {
            throw new Error("Seat already booked");
          }
        });
        await flightModel
          .findOneAndUpdate(
            {
              flight_no: req.body.flight_no,
              "booked_seats.date": req.body.travel_date,
            },
            {
              $set: {
                "available_seats.$.FC": avaliable_seat?.FC! - seats.length,
              },
              $push: { "booked_seats.$.FC": { $each: seats } },
            }
          )
          .exec();

        break;
      case Flightclass.PremiumEconomy:
        seats.forEach((s) => {
          if (booked_seat?.PE.includes(s)) {
            throw new Error("Seat already booked");
          }
        });
        await flightModel
          .findOneAndUpdate(
            {
              flight_no: req.body.flight_no,
              "booked_seats.date": req.body.travel_date,
            },
            {
              $set: {
                "available_seats.$.PE": avaliable_seat?.PE! - seats.length,
              },
              $push: { "booked_seats.$.PE": { $each: seats } },
            }
          )
          .exec();

        break;
    }
    res.status(200).json({ add: 1, message: "Seat Booked!" });
  } catch (e) {
    res.status(400).json({ add: 0, message: "Error!", error: e });
  }
};