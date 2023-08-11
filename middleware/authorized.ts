import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { roleModel } from "../model/roles.model";

export const authorizedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
  role: number
) => {
  try {
    let seckey: string = process.env.SEC_KEY ?? "goibibo_Sec_key";
    let token: any = req.cookies.token;
    let decode: JwtPayload = <JwtPayload>jwt.decode(token);
    const findrole = await roleModel.findById(decode.role).exec();
    console.log(token);
    let verfied = jwt.verify(token, seckey);
    if (verfied && findrole?.role_id! >= role) {
      next();
    } else {
      res.status(401).json({ error: 1, message: "unauthorized access!" });
    }
  } catch (e: any) {
    res.status(400).json({ error: 1, error_desc: e.message });
  }
};
