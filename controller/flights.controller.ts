import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { userModel } from "../model/user.model";
import { airlineAdminModel } from "../model/airline_admin.model";
import { ClassMap, FlightBase, SeatAvalibility } from "../helper/interfaces";
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

  sourceTime = new Date(sourceTime);
  destinationTime = new Date(destinationTime);
  const token: any = req.headers.token;
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

  const seat_avliable: SeatAvalibility = { BC: 0, EC: 0, PE: 0, FC: 0 };

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

  const findFare = await fareModel
    .findOne({ airline_id: findAirline?._id })
    .exec();

  const findRule = await ruleModel
    .findOne({ airline_id: findAirline?._id })
    .exec();

  if (
    sourceTime < destinationTime &&
    findRoute &&
    findAirline &&
    findUser &&
    findAirbus
  ) {
    const FlightData: FlightBase = {
      flight_no: `${findAirlineDetails?.airline_code}-${findRoute.route_id}-${findAirbus.airbus_code}`,
      airline_id: findAirlineDetails?._id ?? null,
      route_id: findRoute._id ?? null,
      airbus_id: findAirbus?._id ?? null,
      fare: findFare?._id ?? null,
      status: FlightStatus.Schduleded,
      timing: {
        source_time: new Date(req.body.source_time),
        destination_time: new Date(req.body.destination_time),
      },
      available_seats: seat_avliable,
      rule: findRule?._id ?? null,
      booked_seats: { BC: [], EC: [], PE: [], FC: [] },
    };
    try {
      const newFlight = new flightModel(FlightData);
      await newFlight.save();
      res.status(400).json({ add: 1, message: "Flight Schedulded!" });
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
    .populate({ path: "airline_id" })
    .populate({
      path: "route_id",
      populate: { path: "source_city destination_city" },
    })
    .populate({ path: "airbus_id" })
    .exec();

  res.status(200).send(data);
};

export const getMyAirlineFlights = async (req: Request, res: Response) => {
  let token: any = req.headers.token;
  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  let findUser = await userModel.findOne({ email: decode.email }).exec();

  const findAirlineId = await airlineAdminModel
    .findOne({
      user_id: findUser?._id,
    })
    .exec();
  const data = await flightModel
    .find({ airline_id: findAirlineId?.airline_id })
    .exec();
  res.status(200).send(data);
};


