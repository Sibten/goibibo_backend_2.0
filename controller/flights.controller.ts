import jwt, { JwtPayload, decode } from "jsonwebtoken";
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
  BookingBase,
} from "../helper/interfaces";
import { routeModel } from "../model/route.model";
import { Flightclass, FlightStatus } from "../helper/enums";
import { flightModel } from "../model/flight.model";
import { airbusModel } from "../model/airbus.model";
import { airlineModel } from "../model/airline.model";
import { fareModel } from "../model/fare.model";
import { ruleModel } from "../model/rules.model";
import { decodeJWT } from "../helper/decodeJWT";
import { sendMail } from "../helper/sendMail.helper";
import { getRescheduleTemplate } from "../view/reschedule.template";
import { cityModel } from "../model/city.model";
import { bookingModel } from "../model/booking.model";

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

  const bookingId: BookingBase = {
    date: ScheduleDate,
    booking: [],
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

  console.log(findAirlineDetails, findRoute);

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
    const isInternational = req.query.isInternational?.toString() == "true";
    console.log(req.query.isInternational, isInternational);
    const FlightData: FlightBase = {
      flight_no: `${findAirlineDetails?.airline_code}-${
        findRoute.route_id?.split("-")[1]
      }${findAirbus.airbus_code?.toString().replace("-", "")}`,
      is_international: isInternational,
      airline_id: findAirlineDetails?._id ?? null,
      route_id: findRoute._id ?? null,
      airbus_id: findAirbus?._id ?? null,
      fare: findFare?._id ?? null,
      status: FlightStatus.Schduleded,
      rule: findRule?._id ?? null,
    };
    // console.log(FlightData);
    try {
      await flightModel
        .updateOne(
          { flight_no: FlightData.flight_no },
          {
            $push: {
              timing: timing,
              available_seats: seat_avliable,
              booked_seats: bookedSeat,
              bookings: bookingId,
            },
            $set: {
              is_international: FlightData.is_international,
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
  let findUser = await decodeJWT(req);

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

export const updateFlight = async (req: Request, res: Response) => {
  try {
    const flightNo = req.query.flightNo;

    const findFlight = await flightModel
      .findOne({ flight_no: flightNo })
      .populate({ path: "bookings" })
      .exec();

    const emailList: Array<string> = [];

    if (!findFlight) throw new Error("Flight not found!");
    else {
      let data = findFlight.bookings.find(
        (d) =>
          d.date?.toISOString() ==
          new Date(req.body.old_source_time).toISOString()
      );
      data?.booking.forEach((e) => emailList.push(e.mail ?? ""));
    }

    const findUser = await decodeJWT(req);

    const findAirlineId = await airlineAdminModel
      .findOne({
        user_id: findUser?._id,
      })
      .exec();
    const findAirline = await airlineModel
      .findById(findAirlineId?.airline_id)
      .exec();

    const findRoute = await routeModel.findById(findFlight.route_id).exec();

    const sourceCity = await cityModel.findById(findRoute?.source_city).exec();
    const destnCity = await cityModel
      .findById(findRoute?.destination_city)
      .exec();

    if (
      new Date() <= new Date(req.body.new_source_time) &&
      new Date(req.body.new_source_time) <
        new Date(req.body.new_destination_time) &&
      findAirlineId?.airline_id.toString() == findFlight?.airline_id?.toString()
    ) {
      await flightModel
        .findOneAndUpdate(
          {
            flight_no: flightNo,
            timing: {
              $elemMatch: {
                source_time: req.body.old_source_time,
                destination_time: req.body.old_destination_time,
              },
            },
            booked_seats: {
              $elemMatch: {
                date: req.body.old_source_time,
              },
            },
            available_seats: {
              $elemMatch: {
                date: req.body.old_source_time,
              },
            },
            bookings: {
              $elemMatch: {
                date: req.body.old_source_time,
              },
            },
          },
          {
            $set: {
              "timing.$": {
                source_time: req.body.new_source_time,
                destination_time: req.body.new_destination_time,
              },
              "booked_seats.$.date": req.body.new_source_time,
              "available_seats.$.date": req.body.new_source_time,
              "bookings.$.date": req.body.new_source_time,
            },
          }
        )
        .exec();

      let status: any;
      if (emailList.length > 0) {
        const template = getRescheduleTemplate({
          airline: findAirline?.airline_name ?? "",
          flightno: findFlight.flight_no ?? "",
          oldtime: req.body.old_source_time,
          newtime: req.body.new_source_time,
          source: sourceCity?.city_name ?? "",
          destination: destnCity?.city_name ?? "",
        });
        status = await sendMail(
          emailList,
          "Goibibo Important Update: Your Flight has been Rescheduled",
          template
        );
      }
      res
        .status(200)
        .send({ update: 1, message: "Flight Upated!", status: status });
    } else throw new Error("Invalid date or Invalid airline flight id");
  } catch (e) {
    res
      .status(400)
      .json({ update: 0, message: "Something bad happen", desc: e });
  }
};

export const getBookingdetailsOfFlight = async (
  req: Request,
  res: Response
) => {
  const flightNo = req.query.flightNo;
  const date = req.query.date;
  // console.log(flightNo);
  try {
    const data = await flightModel
      .findOne(
        {
          flight_no: flightNo,
          "bookings.date": date,
        },
        { bookings: { $elemMatch: { date: date } } }
      )
      .populate({
        path: "bookings.booking.id",
        select: "jouerny_info addons  payment class_type status ",
        populate: {
          path: "payment jouerny_info.destination_city jouerny_info.source_city",
          select: " -createdAt -updatedAt -_id -__v -user_id",
        },
      })
      .select("bookings -_id ")
      .exec();
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: 1, message: "error", desc: e });
  }
};
