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
import { number } from "joi";
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

const findJouernyFlight = async (flightNo: string) => {
  const findFlight = await flightModel
    .findOne({
      flight_no: flightNo,
    })
    .exec();
  return findFlight ?? null;
};

const updateFlight = async (
  flight_no: string,
  travel_date: string,
  booking_seat: Array<SeatBase>,
  travel_class: number,
  booking_mail: string,
  booking_id: mongoose.Types.ObjectId | null
) => {
  const findFlight = await findJouernyFlight(flight_no);
  try {
    if (!findFlight) throw new Error("Not found");
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
              "booking_id.date": travel_date,
            },
            {
              $set: {
                "available_seats.$.BC": avaliable_seat?.BC! - seats.length,
              },
              $push: {
                "booked_seats.$.BC": { $each: seats },
                "bookings.$.booking": { mail: booking_mail, id: booking_id },
              },
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
              "bookings.date": travel_date,
            },
            {
              $set: {
                "available_seats.$.EC": seat_no,
              },
              $push: {
                "booked_seats.$.EC": { $each: seats },
                "bookings.$.booking": { mail: booking_mail, id: booking_id },
              },
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
              "bookings.date": travel_date,
            },
            {
              $set: {
                "available_seats.$.FC": avaliable_seat?.FC! - seats.length,
              },
              $push: {
                "booked_seats.$.FC": { $each: seats },
                "bookings.$.booking": { mail: booking_mail, id: booking_id },
              },
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
              "bookings.date": travel_date,
            },
            {
              $set: {
                "available_seats.$.PE": avaliable_seat?.PE! - seats.length,
              },
              $push: {
                "booked_seats.$.PE": { $each: seats },
                "bookings.$.booking": { mail: booking_mail, id: booking_id },
              },
            }
          )
          .exec();
        break;
    }
  } catch (e) {
    return;
  }
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

      const token: any = req.cookies.token;

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

      const destn_city = await findCity(IncomingData.destn_city_code);
      const source_city = await findCity(IncomingData.source_city_code);

      const newPayment = new paymentModel(data);
      newPayment.save();

      const dep_flight = await findJouernyFlight(IncomingData.dep_flight_no);
      let rtn_flight = null;
      if (IncomingData.return_date && IncomingData.rtn_flight_no) {
        rtn_flight = await findJouernyFlight(IncomingData.rtn_flight_no);
      }
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
          departure_flight: dep_flight?._id!,
          return_flight: rtn_flight?._id!,
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
      await updateFlight(
        IncomingData.dep_flight_no,
        IncomingData.dep_date,
        IncomingData.dep_booking_seat,
        IncomingData.travel_class,
        newBooking?.ticket_email ?? "",
        newBooking?._id ?? null
      );
      if (IncomingData.rtn_flight_no && IncomingData.return_date) {
        await updateFlight(
          IncomingData.rtn_flight_no,
          IncomingData.return_date,
          IncomingData.rtn_booking_seat,
          IncomingData.travel_class,
          newBooking?.ticket_email ?? "",
          newBooking?._id
        );
      }

      // bookingData.jouerny_info.peoples[0],
      // bookingData.PNR_no,
      // bookingData.jouerny_info.departure_date,
      // IncomingData.source_city_code,
      // IncomingData.destn_city_code,
      // bookingData.jouerny_info.peoples.length +
      //   bookingData.jouerny_info.infants.length,
      // getFlightClass(bookingData.class_type),
      // data.razor_pay_id
      try {
        const temp = bookingTemplate(
          {
            name: `${bookingData.jouerny_info.peoples[0].first_name}${bookingData.jouerny_info.peoples[0].last_name}`,
            pnr: bookingData.PNR_no,
            email: bookingData.ticket_email,
          },
          bookingData.jouerny_info.departure_date,
          IncomingData.source_city_code,
          IncomingData.destn_city_code,
          bookingData.jouerny_info.peoples.length +
            bookingData.jouerny_info.infants.length,
          getFlightClass(bookingData.class_type),
          data.razor_pay_id
        );
        const status = await sendMail(
          bookingData.ticket_email,
          "Goibibo - Booking Confirmation: Your Flight is Confirmed",
          temp
        );
        // console.log(bookingData.ticket_email);

        res.status(200).json({
          payment: 1,
          message: "Payment Succesful and Booking Confirmed!",
          status: status,
        });
      } catch (e) {
        throw new Error("booking template error");
      }
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
  const token: any = req.cookies.token;
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
      amount: req.body.amount * 100,
    });
    return { message: "Payment Refund Issues generated!", data: d };
  } catch (e) {
    res.status(400);
    return { message: "Somthing bad happen!", error: e };
  }
};

export const updateFlightIncSeat = async (
  flight: string,
  date: Date,
  travel_class: number,
  seats: Array<String>,
  booking_id: mongoose.Types.ObjectId | null
) => {
  const totalSeat = seats.length;
  switch (travel_class) {
    case Flightclass.Business:
      await flightModel.findOneAndUpdate(
        {
          flight_no: flight,
          "available_seats.date": date,
          "booked_seats.date": date,
          "bookings.date": date,
        },
        {
          $inc: {
            "available_seats.$.BC": totalSeat,
          },
          $pull: {
            "booked_seats.$.BC": { $in: seats },
            "bookings.$.booking": { id: booking_id },
          },
        }
      );
      return;
    case Flightclass.Economy:
      console.log(seats.length);
      await flightModel.findOneAndUpdate(
        {
          flight_no: flight,
          "available_seats.date": date,
          "booked_seats.date": date,
          "bookings.date": date,
        },
        {
          $inc: {
            "available_seats.$.EC": totalSeat,
          },
          $pull: {
            "booked_seats.$.EC": { $in: seats },
            "bookings.$.booking": { id: booking_id },
          },
        }
      );
      console.log("Eco update");

      return;
    case Flightclass.FirstClass:
      await flightModel.findOneAndUpdate(
        {
          flight_no: flight,
          "available_seats.date": date,
          "booked_seats.date": date,
          "bookings.date": date,
        },
        {
          $inc: {
            "available_seats.$.FC": totalSeat,
          },
          $pull: {
            "booked_seats.$.FC": { $in: seats },
            "bookings.$.booking": { id: booking_id },
          },
        }
      );
      return;
    case Flightclass.PremiumEconomy:
      await flightModel.findOneAndUpdate(
        {
          flight_no: flight,
          "available_seats.date": date,
          "booked_seats.date": date,
          "bookings.date": date,
        },
        {
          $inc: {
            "available_seats.$.PE": totalSeat,
          },
          $pull: {
            "booked_seats.$.PE": { $in: seats },
            "bookings.$.booking": { id: booking_id },
          },
        }
      );
      return;
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  const pnr = req.body.PNR_no;
  console.log(pnr);

  try {
    const findBooking = await bookingModel
      .findOne({ PNR_no: pnr }, { jouerny_info: 1, payment: 1 })
      .exec();
    // console.log(findBooking);
    // res.json(findBooking);
    // return;
    if (findBooking) {
      const depseats: Array<string> = [];

      findBooking.jouerny_info?.peoples.forEach((d: any) =>
        depseats.push(d.seat_no.seat_no)
      );

      // console.log(depseats);
      const depFlight = await flightModel
        .findById(findBooking.jouerny_info?.departure_flight)
        .exec();
      // console.log(depFlight);
      await updateFlightIncSeat(
        depFlight?.flight_no ?? "",
        findBooking.jouerny_info?.departure_date!,
        findBooking.class_type ?? 0,
        depseats,
        findBooking._id
      );
      // res.status(200).json(rtn);
      if (findBooking.jouerny_info?.return_date) {
        console.log("first");
        let rtnFlight = await flightModel
          .findById(findBooking.jouerny_info?.return_flight)
          .exec();

        const rtnseat: Array<string> = [];

        findBooking.jouerny_info.peoples.forEach((d) => {
          rtnseat.push(d.rtn_seat_no.seat_no);
        });

        await updateFlightIncSeat(
          rtnFlight?.flight_no ?? "",
          findBooking.jouerny_info?.return_date!,
          findBooking.class_type ?? 0,
          rtnseat,
          findBooking._id
        );
      }

      const findPayment = await paymentModel
        .findById(findBooking.payment)
        .exec();
      let paymentRefund: any;
      console.log(findPayment);
      if (findPayment) {
        req.body.amount =
          (findPayment.payment_amount?.basic_total ?? 0) +
          (findPayment.payment_amount?.total_add_on ?? 0);
        req.body.payment_id = findPayment.razor_pay_id;

        console.log(req.body);
        paymentRefund = await IssueRefund(req, res);

        await bookingModel.findByIdAndUpdate(findBooking._id, {
          $set: { status: BookingStatus.Cancel },
        });
        res.status(200).json({
          cancel: 1,
          message: "Booking successfully cancelled",
          payment: paymentRefund,
        });
      } else throw new Error("Payment error");

      // res.status(200).json(seats);
    } else res.status(204).json({ cancel: 0, message: "PNR not found!" });
  } catch (e) {
    res.status(400).json({ message: "Somthing bad happen!", error: e });
  }
};
