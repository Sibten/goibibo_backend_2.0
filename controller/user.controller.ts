import { Request, Response } from "express";
import { userModel } from "../model/user.model";
import { otpModel } from "../model/otp-user.model";
import { validateUser } from "../validator/user.validate";
import otpGenerator from "otp-generator";
import { validateEmail } from "../validator/otp-email.validate";
import { sendMailtoClient } from "../helper/sendOTP.helper";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendMail } from "../helper/sendMail.helper";
import { welcomeGreetinghtml } from "../view/welcome.template";
import { roles } from "../helper/enums";
import { roleModel } from "../model/roles.model";
import { uploadImage } from "../helper/awsmethods";
import { FileParams } from "../helper/interfaces";
import { bookingModel } from "../model/booking.model";
import { JwtPayload } from "jsonwebtoken";

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const validate = validateUser(req.body);
  const findRole = await roleModel.findOne({ role_name: "User" }).exec();
  if (!validate["error"]) {
    let payload: any = {
      profile_photo:
        "https://res.cloudinary.com/dgsqarold/image/upload/v1685697769/Goibibo/3237472_tgty4m.png",
      email: req.body.email,
      role: findRole?._id ?? "",
      user_name: "TRAVELLER",
    };
    try {
      let seckey = process.env.SEC_KEY ?? "goibibo_Sec_key";
      const token: string = jwt.sign(payload, seckey);
      let findRole = await roleModel.findOne({ role_id: roles.User }).exec();
      payload.role = findRole?._id;

      const newUser = new userModel(payload);
      await newUser.save();

      let status = await sendMail(
        req.body.email,
        "Greetings from Goibibo",
        welcomeGreetinghtml(req.body.user_name)
      );
      res.status(200).json({
        login: 1,
        newuser: 1,
        verfied: 1,
        message: "New user added & logged in",
        token: token,
        status: status,
      });
    } catch (e) {
      res.status(500).json({
        error: 1,
        message: "Internal database error",
        error_desc: e,
      });
    }
  } else {
    res.status(400).json({
      error: 1,
      message: "User data validation error!",
      error_desc: validate["error"],
    });
  }
};

export const uploadProfilePhoto = async (req: Request, res: Response) => {
  let data: any = Object.assign({}, req.body);
  let file: any = Object.assign({}, req.files);
  if (file.file) {
    const fileParams: FileParams = {
      Bucket: "goibibo-sibten",
      Key: file.file.name,
      Body: file.file.data,
      ContentType: file.file.mimetype,
    };

    let url = await uploadImage(fileParams);

    if (url) {
      await userModel
        .updateOne({ email: data.email }, { $set: { profile_photo: url } })
        .exec();
      res
        .status(200)
        .json({ update: 1, message: "Profile Picture is Updated!" });
    } else {
      res
        .status(400)
        .json({ update: 0, message: "URL is not able to generate" });
    }
  } else {
    res.status(400).json({ update: 0, message: "file is not in proper " });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  let mail = req.body.email;
  let validate = validateUser(req.body);
  let findUser = await userModel.findOne({ email: mail }).exec();
  req.body.role = findUser?.role;
  if (!validate["error"]) {
    if (findUser) {
      try {
        if (req.body.password)
          req.body.password = await bcrypt.hash(req.body.password, 10);
        await userModel.updateOne({ email: mail }, { $set: req.body }).exec();
        res.status(200).json({
          validation: 1,
          update: 1,
          message: "Sucessfully Updated!",
        });
      } catch (e) {
        res.status(500).json({
          update: 0,
          error: 1,
          error_desc: e,
        });
      }
    } else {
      res
        .status(200)
        .json({ validation: 1, findstatus: 0, message: "User not found" });
    }
  } else {
    res.status(400).json({
      update: 0,
      validation: 0,
      message: "Update paramater not proper!",
      err_desc: validate["error"],
    });
  }
};

export const generateOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  let validate = validateEmail(req.body);
  if (!validate["error"]) {
    const email_id = req.body.email;
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    try {
      const date: Date = new Date();
      let expiryTime: Date = new Date(date.getTime() + 1000 * 60 * 5);
      let findMail = await otpModel.findOne({ email: email_id }).exec();
      console.log(findMail);
      await otpModel
        .updateOne(
          { email: email_id },
          {
            $set: {
              email: email_id,
              otp: OTP,
              sent_time: date,
              expriy_time: expiryTime,
            },
          },
          { upsert: true }
        )
        .exec();
      let status = await sendMailtoClient(email_id, OTP);

      if (findMail) {
        res.status(200).json({
          found: 1,
          otp: OTP,
          email: email_id,
          date: date,
          expiryTime: expiryTime,
          status: status,
        });
      } else {
        res.status(200).json({
          found: 0,
          email: email_id,
          otp: OTP,
          date: date,
          expiryTime: expiryTime,
          status: status,
        });
      }
    } catch (e) {
      res.status(500).json({
        error: 1,
        error_desc: e,
      });
    }
  } else {
    res.status(400).json({
      error: 1,
      message: "email validation error!",
      error_desc: validate["error"],
    });
  }
};

export const validateOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  const mobileNo = req.body.email;
  const OTP = req.body.otp;
  let findOTP = await otpModel.findOne({ email: mobileNo }).exec();
  let findUser = await userModel.findOne({ email: mobileNo }).exec();
  const date = new Date();
  if (findOTP) {
    if (OTP == findOTP?.otp && !findUser && date <= findOTP?.expriy_time!) {
      await addUser(req, res);
    } else if (
      OTP == findOTP?.otp &&
      findUser &&
      date <= findOTP?.expriy_time!
    ) {
      let payload = { email: findUser.email, role: findUser.role };
      let seckey = process.env.SEC_KEY ?? "goibibo_Sec_key";
      const token = jwt.sign(payload, seckey);
      res.status(200).json({
        login: 1,
        verfied: 1,
        message: "login sucess",
        token: token,
      });
    } else {
      res.status(200).json({
        verification: 0,
        message: "OTP Verification failed or OTP Expired",
      });
    }
  } else {
    res.status(400).json({ error: 1, message: "Email id not found" });
  }
};

export const loginViaCredential = async (req: Request, res: Response) => {
  let mail = req.body.email;
  let password = req.body.password;
  let finduser = await userModel.findOne({ email: mail }).exec();

  if (finduser) {
    let compare = await bcrypt.compare(password, finduser.password!);
    let payload = { email: finduser.email, role: finduser.role };
    let seckey = process.env.SEC_KEY ?? "goibibo_Sec_key";
    const token = jwt.sign(payload, seckey, { expiresIn: "1h" });
    if (compare) {
      res.status(200).json({ login: 1, message: "Login Sucess", token: token });
    } else {
      res.status(401).json({ login: 0, message: "Unauthorized Access!" });
    }
  } else {
    res
      .status(401)
      .json({ login: 0, findstatus: 0, message: "User not found!" });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  let findUser = await userModel
    .findOne(
      { email: req.query.email },
      {
        _id: 0,
        role: 1,
        user_name: 1,
        email: 1,
        profile_photo: 1,
        date_of_birth: 1,
        first_name: 1,
        middle_name: 1,
        last_name: 1,
        gender: 1,
        city: 1,
        nationality: 1,
        state: 1,
        pincode: 1,
        billing_address: 1,
      }
    )
    .populate({ path: "role", select: "role_id role_name -_id" })
    .exec();
  res.status(200).json(findUser);
};

export const getMyTrips = async (req: Request, res: Response) => {
  const token: any = req.headers.token;
  const decode: JwtPayload = <JwtPayload>jwt.decode(token);
  const findUser = await userModel.findOne({ email: decode.email }).exec();

  const bookingData = await bookingModel
    .find({ user_id: findUser?._id }, { __v: 0, createdAt: 0, updatedAt: 0 })
    .populate({ path: "jouerny_info.destination_city", select: "-_id -__v" })
    .populate({ path: "jouerny_info.source_city", select: "-_id -__v" })
    .populate({
      path: "jouerny_info.departure_flight",
      select: "-_id flight_no",
      populate: {
        path: "airline_id",
        select: "-_id -__v -createdAt -updatedAt",
      },
    })
    .populate({
      path: "jouerny_info.return_flight",
      select: "-_id flight_no",
      populate: {
        path: "airline_id",
        select: "-_id -__v -createdAt -updatedAt",
      },
    })
    .populate({
      path: "payment",
      select: "-_id -__v -createdAt -updatedAt -user_id",
    })
    .exec();

  res.status(200).send(bookingData);
};
