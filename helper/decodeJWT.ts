import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userModel } from "../model/user.model";


export const decodeJWT = async (req: Request): Promise<any> => {
  const token = req.cookies.token;

  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  console.log(decode);
  let findUser = await userModel.findOne({ email: decode.email }).exec();
  return findUser;
};
