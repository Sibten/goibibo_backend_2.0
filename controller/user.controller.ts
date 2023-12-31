import { Request, Response } from "express";
import { userModel } from "../model/user.model";
import { otpModel } from "../model/otp-user.model";
import { validateUser } from "../validator/user.validate";
import otpGenerator from "otp-generator";
import { validateEmail } from "../validator/otp-email.validate";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendMail } from "../helper/sendMail.helper";
import { welcomeGreetinghtml } from "../view/welcome.template";
import { roles } from "../helper/enums";
import { roleModel } from "../model/roles.model";
import { uploadImage } from "../helper/awsmethods";
import { AirlineAdminBase, FileParams } from "../helper/interfaces";
import { bookingModel } from "../model/booking.model";
import { insertAirlineAdmin } from "./airline_admin.controller";
import { airlineModel } from "../model/airline.model";
import { validatePassword } from "../validator/password.validate";
import { authentication } from "../middleware/authentication";
import { sendMailtoClient } from "../helper/sendOTP.helper";

export const addUser = async (
  req: Request,
  res: Response,
  role: number
): Promise<any> => {
  const validate = validateUser(req.body);

  const findRole = await roleModel.findOne({ role_id: role }).exec();

  const findUser = await userModel.findOne({ email: req.body.email }).exec();

  if (!validate.error && !findUser) {
    try {
      const payload = {
        profile_photo:
          "https://res.cloudinary.com/dgsqarold/image/upload/v1685697769/Goibibo/3237472_tgty4m.png",
        email: req.body.email,
        role: findRole?._id ?? "",
        user_name: "TRAVELLER",
        password: "",
      };
      let seckey = process.env.SEC_KEY ?? "goibibo_Sec_key";
      const token: string = jwt.sign(
        { email: payload.email, role: payload.role },
        seckey
      );
      if (role == roles.Admin) {
        payload.password = (await bcrypt.hash(req.body.password, 8)) ?? "";
        const newUser = new userModel(payload);
        await newUser.save();
        return {
          login: 1,
          id: newUser._id,
        };
      }
      let status = await sendMail(
        req.body.email,
        "Greetings from Goibibo",
        welcomeGreetinghtml(req.body.user_name)
      );
      // let status = "";

      const newUser = new userModel(payload);
      await newUser.save();
      res.status(200);
      res.cookie("email", payload.email);
      res.cookie("token", token);
      return {
        login: 1,
        newuser: 1,
        verfied: 1,
        message: "New user added & logged in",
        token: token,
        status: status,
      };
    } catch (e) {
      res.status(400);
      return {
        login: 0,
        message: "Something bad happen!",
        error_desc: e,
      };
    }
  } else {
    res.status(400);
    return {
      login: 0,
      message: "User data validation error! or user alreday present",
      error_desc: validate["error"] ?? "",
    };
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
      // let status = "";

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

export const createAdminUser = async (req: Request, res: Response) => {
  try {
    const response = await addUser(req, res, roles.Admin);

    if (response.login) {
      const airline = await airlineModel
        .findOne({ airline_id: req.query.airline })
        .exec();
      if (airline) {
        const data: AirlineAdminBase = {
          airline_id: airline._id,
          user_id: response.id,
        };
        await insertAirlineAdmin(data, res);
      } else throw new Error("Unable to find the airline");
    } else res.send(response);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Something bad happen!", error: 1, desc: e });
  }
};

export const validateOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  const email = req.body.email;
  const OTP = req.body.otp;
  let findOTP = await otpModel.findOne({ email: email }).exec();
  let findUser = await userModel.findOne({ email: email }).exec();
  const date = new Date();
  if (findOTP) {
    if (OTP == findOTP?.otp && !findUser && date <= findOTP?.expriy_time!) {
      const response = await addUser(req, res, roles.User);
      res.json(response);
    } else if (
      OTP == findOTP?.otp &&
      findUser &&
      date <= findOTP?.expriy_time!
    ) {
      let seckey = process.env.SEC_KEY ?? "goibibo_Sec_key";
      let payload = { email: findUser.email, role: findUser.role };
      const token = jwt.sign(payload, seckey);
      console.log(token);
      res.cookie("email", email);
      res.cookie("token", token);
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

export const getRole = async (req: Request, res: Response) => {
  let findUser = await userModel
    .findOne({ email: req.query.email })
    .populate({ path: "role", select: "role_id -_id" })
    .exec();
  res.status(200).json({ role: findUser?.role });
};

export const genAdminOTP = async (req: Request, res: Response) => {
  try {
    const findAdmin = await userModel.findOne({ email: req.body.email }).exec();
    const findRole = await roleModel.findById(findAdmin?.role).exec();
    if (findRole?.role_id == roles.Admin) {
      await generateOTP(req, res);
    } else {
      res.status(401).json({ otp: 0, message: "Unauthorized access!" });
    }
  } catch (e) {
    res.status(400).json({ otp: 0, message: "Something bad happen!", desc: e });
  }
};

export const verifyAdminOTP = async (req: Request, res: Response) => {
  try {
    const findOTP = await otpModel.findOne({ email: req.body.email }).exec();
    if (findOTP?.otp == parseInt(req.body.otp)) {
      res.status(200).json({ valid: 1, message: "Otp verification is done" });
    } else
      res.status(401).json({ valid: 0, message: "Otp verifcation is failed" });
  } catch (e) {
    res
      .status(400)
      .json({ valid: 0, message: "Something bad happen!", desc: e });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const validate = validatePassword(req.body);
  let findUser = await userModel.findOne({ email: req.body.email }).exec();
  if (findUser && !validate.error) {
    try {
      const password = await bcrypt.hash(req.body.password, 8);
      await userModel
        .findByIdAndUpdate(findUser._id, { $set: { password: password } })
        .exec();

      res
        .status(200)
        .json({ update: 1, message: "Password updated Successfully!" });
    } catch (e) {
      res
        .status(400)
        .json({ update: 0, message: "something bad happen!", desc: e });
    }
  } else {
    res.status(401).json({
      update: 0,
      message: "unauthorized access! or validation error!",
    });
  }
};

export const loginViaCredential = async (req: Request, res: Response) => {
  let mail = req.body.email;
  let password = req.body.password;
  let finduser = await userModel.findOne({ email: mail }).exec();
  console.log(finduser);
  if (finduser) {
    let compare = await bcrypt.compare(password, finduser.password);
    let payload = { email: finduser.email, role: finduser.role };
    let seckey = process.env.SEC_KEY ?? "goibibo_Sec_key";
    const token = jwt.sign(payload, seckey);
    res.cookie("email", finduser.email);
    res.cookie("token", token);
    console.log(compare);
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
  const status = await authentication(req);

  if (status) {
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
  } else {
    res.status(401).json({ find: 0, message: "Unauthorized Access!" });
  }
};

export const getMyTrips = async (req: Request, res: Response) => {
  const token: any = req.cookies.token;
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

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("email");
    res.clearCookie("token");
    res.status(200).json({ logout: 1, message: "logout" });
  } catch (e) {
    res.status(400);
  }
};
