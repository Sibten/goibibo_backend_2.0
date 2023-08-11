import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userModel } from "../model/user.model";

export const authentication = async (req: Request): Promise<boolean> => {
  const token = req.cookies.token;
  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  let findUser = await userModel
    .findOne({ email: req.body.email ?? req.query.email })
    .exec();

  if (
    findUser &&
    (req.body.email == decode.email || req.query.email == decode.email)
  )
    return true;
  return false;
};
