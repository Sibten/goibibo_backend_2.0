import Razorpay from "razorpay";
import env from "dotenv";
import { Request, Response } from "express";
import { createHmac } from "crypto";
import { paymentModel } from "../model/payment.model";
import { PaymentBase, SeatBase, BookingData } from "../helper/interfaces";
import { userModel } from "../model/user.model";
import mongoose from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";

import { flightModel } from "../model/flight.model";
import { BookingStatus, Flightclass } from "../helper/enums";
import { bookingModel } from "../model/booking.model";
import { cityModel } from "../model/city.model";
import { sendMail } from "../helper/sendMail.helper";
import { bookingTemplate } from "../view/booking.template";
import { getFlightClass } from "../helper/Methods";
env.config();

export const createPaymentOrder = (req: Request, res: Response) => {
  const key_id = process.env.RZP_KEYID ?? "";
  const sec_key = process.env.RZP_KEYSEC ?? "";

  const instance = new Razorpay({
    key_id: key_id,
    key_secret: sec_key,
  });

  const options = {
    amount: parseInt(req.query.amount?.toString()!) * 100,
    currency: "INR",
  };

  console.log(options);

  try {
    instance.orders.create(options, (err, order) => {
      res.status(200).send(order);
    });
  } catch (e) {
    res.status(400).json({ message: "Somthing bad happen!", error: e });
  }
};

const updateFlight = async (
  flight_no: string,
  travel_date: string,
  booking_seat: Array<SeatBase>,
  travel_class: number
) => {
  const findFlight = await flightModel
    .findOne({
      flight_no: flight_no,
    })
    .exec();

  const avaliable_seat = findFlight?.available_seats.find(
    (s) => s.date?.toDateString() == new Date(travel_date).toDateString()
  );

  const booked_seat = findFlight?.booked_seats.find(
    (s) => s.date?.toDateString() == new Date(travel_date).toDateString()
  );

  let seats: Array<string> = [];

  const seatData: Array<SeatBase> = booking_seat;

  seatData?.forEach((s) => seats.push(s.seat_no));

  switch (travel_class) {
    case Flightclass.Business:
      seats.forEach((s) => {
        if (booked_seat?.BC.includes(s)) {
          throw new Error("Seat already booked");
        }
      });

      await flightModel
        .findOneAndUpdate(
          {
            flight_no: flight_no,
            "booked_seats.date": travel_date,
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
          console.log("seat...");
          throw new Error("Seat already booked");
        }
      });

      const seat_no = avaliable_seat?.EC! - seats.length;

      await flightModel
        .findOneAndUpdate(
          {
            flight_no: flight_no,
            "booked_seats.date": travel_date,
          },
          {
            $set: {
              "available_seats.$.EC": seat_no,
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
            flight_no: flight_no,
            "booked_seats.date": travel_date,
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
            flight_no: flight_no,
            "booked_seats.date": travel_date,
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
  return findFlight?._id ?? null;
};

const findCity = async (code: string) => {
  const data = await cityModel.findOne({ airport_code: code }).exec();
  return data?._id ?? null;
};

export const validatePayment = async (req: Request, res: Response) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  try {
    const sec_key = process.env.RZP_KEYSEC ?? "";

    const order_id = req.body.rzpinfo.razorpay_order_id;
    const razor_pay_id = req.body.rzpinfo.razorpay_payment_id;
    const signature = req.body.rzpinfo.razorpay_signature;

    const hash = createHmac("sha256", sec_key)
      .update(`${order_id}|${razor_pay_id}`)
      .digest("hex");

    if (hash === signature) {
      console.log("verified");
      const IncomingData = {
        dep_flight_no: req.body.dep_flight_no,
        rtn_flight_no: req.body.rtn_flight_no ?? null,
        payment: req.body.payment,
        travel_class: parseInt(req.body.travel_class),
        dep_date: req.body.dep_date,
        return_date: req.body.rtn_date ?? null,
        dep_booking_seat: req.body.dep_booking_seat, // Array of Seat base
        rtn_booking_seat: req.body.rtn_booking_seat ?? null, // Array of Seat base
        email: req.body.email,
        destn_city_code: req.body.destn_city_code,
        source_city_code: req.body.source_city_code,
      };

      const token: any = req.headers.token;

      const decode: JwtPayload = <JwtPayload>jwt.decode(token);
      const findUser = await userModel.findOne({ email: decode.email }).exec();

      let data: PaymentBase = {
        order_id: req.body.rzpinfo.razorpay_order_id,
        razor_pay_id: req.body.rzpinfo.razorpay_payment_id,
        transaction_stamp: new Date(),
        user_id: (findUser?._id as mongoose.Types.ObjectId) ?? null,
        status: 1,
        payment_amount: IncomingData.payment,
      };

      const dep_flight = await updateFlight(
        IncomingData.dep_flight_no,
        IncomingData.dep_date,
        IncomingData.dep_booking_seat,
        IncomingData.travel_class
      );

      console.log(dep_flight);

      let rtn_flight = null;
      if (IncomingData.rtn_flight_no && IncomingData.return_date) {
        rtn_flight = await updateFlight(
          IncomingData.rtn_flight_no,
          IncomingData.return_date,
          IncomingData.rtn_booking_seat,
          IncomingData.travel_class
        );
      }

      const destn_city = await findCity(IncomingData.destn_city_code);
      const source_city = await findCity(IncomingData.source_city_code);

      const newPayment = new paymentModel(data);
      newPayment.save();

      const bookingData: BookingData = {
        booking_stamp: new Date(),
        PNR_no: Date.now(),
        user_id: (findUser?._id as mongoose.Types.ObjectId) ?? null,
        class_type: IncomingData.travel_class,
        ticket_email: IncomingData.email,
        status: BookingStatus.Upcoming,
        jouerny_info: {
          departure_date: IncomingData.dep_date,
          return_date: IncomingData.return_date,
          destination_city: destn_city,
          source_city: source_city,
          departure_flight: dep_flight,
          return_flight: rtn_flight,
          peoples: [...req.body.peoples],
          infants: req.body.infants,
          address: req.body.address,
          state: req.body.state,
          pincode: parseInt(req.body.pincode),
        },
        addons: {
          departure_addons: req.body.addons.departure_addons,
          return_addons: req.body.return_addons,
        },
        payment: newPayment._id,
      };

      const newBooking = new bookingModel(bookingData);
      await newBooking.save();

      const temp = bookingTemplate(
        bookingData.jouerny_info.peoples[0].first_name,
        bookingData.PNR_no,
        bookingData.jouerny_info.departure_date,
        IncomingData.source_city_code,
        IncomingData.destn_city_code,
        bookingData.jouerny_info.peoples.length +
          bookingData.jouerny_info.infants.length,
        getFlightClass(bookingData.class_type),
        data.razor_pay_id
      );
      console.log(bookingData.ticket_email);

      const status = await sendMail(
        bookingData.ticket_email,
        "Goibibo Booking Confirmation",
        temp
      );

      res.status(200).json({
        payment: 1,
        message: "Payment Succesful and Booking Confirmed!",
        status: status,
      });
    } else {
      throw new Error("Invalid Transaction");
    }
    // session.commitTransaction();
  } catch (e) {
    // session.abortTransaction();
    res
      .status(400)
      .json({ payment: 0, message: "Something bad happen!", error: e });
  }
  // finally {
  //   session.endSession();
  // }
};

export const getMyPayments = async (req: Request, res: Response) => {
  const token: any = req.headers.token;
  const decode: JwtPayload = <JwtPayload>jwt.decode(token);
  const findUser = await userModel.findOne({ email: decode.email }).exec();

  const findPayments = await paymentModel
    .find({ user_id: findUser?._id })
    .populate({ path: "user_id" })
    .exec();

  res.status(200).send(findPayments);
};

export const IssueRefund = async (req: Request, res: Response) => {
  const key_id = process.env.RZP_KEYID ?? "";
  const sec_key = process.env.RZP_KEYSEC ?? "";
  const instance = new Razorpay({
    key_id: key_id,
    key_secret: sec_key,
  });
  const paymentId = req.body.payment_id! ?? "";
  try {
    const d = instance.payments.refund(paymentId, {
      speed: "normal",
    });
    res
      .status(200)
      .json({ message: "Payment Refund Issues generated!", data: d });
  } catch (e) {
    res.status(400).json({ message: "Somthing bad happen!", error: e });
  }
};