import Razorpay from "razorpay";
import env from "dotenv";
import { Request, Response, request } from "express";
import { createHmac } from "crypto";
import { paymentModel } from "../model/payment.model";
import { PaymentBase } from "../helper/interfaces";
import { userModel } from "../model/user.model";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
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

  try {
    instance.orders.create(options, (err, order) => {
      res.status(200).send(order);
    });
  } catch (e) {
    res.status(400).json({ message: "Somthing bad happen!", error: e });
  }
};

export const validatePayment = async (req: Request, res: Response) => {
  const session = mongoose.startSession();
  try {
    (await session).startTransaction();

    const sec_key = process.env.RZP_KEYSEC ?? "";

    const order_id = req.body.rzpinfo.razorpay_order_id;
    const razor_pay_id = req.body.rzpinfo.razorpay_payment_id;
    const signature = req.body.rzpinfo.razorpay_signature;

    const hash = createHmac("sha256", sec_key)
      .update(`${order_id}|${razor_pay_id}`)
      .digest("hex");

    if (hash === signature) {
      const token: any = req.headers.token;

      const decode: JwtPayload = <JwtPayload>jwt.decode(token);
      const findUser = await userModel.findOne({ email: decode.email }).exec();

      let data: PaymentBase = {
        order_id: req.body.rzpinfo.razorpay_order_id,
        razor_pay_id: req.body.rzpinfo.razorpay_payment_id,
        transaction_stamp: new Date(),
        user_id: (findUser?._id as mongoose.Types.ObjectId) ?? null,
        status: 1,
        payment_amount: req.body.payment,
      };
      const newPayment = new paymentModel(data);
      newPayment.save();

      // Validate Seat
      // const bookingData;

      // Add in Booking table

      res
        .status(200)
        .json({ payment: 0, message: "Payment Successfully Validate" });
    } else {
      res.status(400).json({ payment: 0, message: "Invalid Payment" });
    }

    (await session).commitTransaction();
  } catch (e) {
    res
      .status(400)
      .json({ payment: 0, message: "Something Bad happen!", error: e });
  }
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
