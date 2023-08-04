import { routeModel } from "../model/route.model";
import { Request, Response } from "express";
import { validateRoute } from "../validator/route.validate";
import node_geocoder from "node-geocoder";
import mongoose from "mongoose";
import { cityModel } from "../model/city.model";
import process = require("process");
import GeoPoint from "geopoint";
import { RouteBase } from "../helper/interfaces";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { userModel } from "../model/user.model";
import { airlineModel } from "../model/airline.model";
import { airlineAdminModel } from "../model/airline_admin.model";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const geocoder = node_geocoder({ provider: "openstreetmap" });

const findGeoCode = async (city: string) => {
  return new Promise((resolve, reject) => {
    geocoder
      .geocode(city)
      .then((d) => resolve(d))
      .catch((e) => reject(e));
  });
};

const finddistance = async (
  Source: string,
  Destination: string
): Promise<number> => {
  let sourceGeo: any = await findGeoCode(Source);
  let destinationGeo: any = await findGeoCode(Destination);

  let point1 = new GeoPoint(sourceGeo[0].latitude, sourceGeo[0].longitude);
  let point2 = new GeoPoint(
    destinationGeo[0].latitude,
    destinationGeo[0].longitude
  );

  return new Promise((res, rej) => {
    if (sourceGeo && destinationGeo) {
      res(point1.distanceTo(point2, true));
    } else rej(0);
  });
};

const findCity = async (code: string) => {
  const city = await cityModel.findOne({ airport_code: code }).exec();
  return city;
};

export const addRoute = async (req: Request, res: Response) => {
  let token: any = req.headers.token;

  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  let findUser = await userModel.findOne({ email: decode.email }).exec();

  const findAirlineId = await airlineAdminModel
    .findOne({
      user_id: findUser?._id,
    })
    .exec();

  const findAirlineDetails = await airlineModel
    .findOne({ _id: findAirlineId?.airline_id })
    .exec();

  let valid = validateRoute(req.body);
  if (!valid["error"]) {
    let sourceCity = await findCity(req.body.source_city);
    let destinationCity = await findCity(req.body.destination_city);
    const stops: Array<mongoose.Types.ObjectId | null> = [];
    req.body.stops.forEach(async (s: string) => {
      if (s) {
        let stopCity = await findCity(s);
        stops.push(stopCity?._id!);
      }
    });
    const distance: number = await finddistance(
      sourceCity?.airport_name!,
      destinationCity?.airport_name!
    );

    const routeData: RouteBase = {
      route_id: `${findAirlineDetails?.airline_code}-${sourceCity?.city_id}${destinationCity?.city_id}${req.body.stops.length}`,
      source_city: sourceCity?._id ?? null,
      destination_city: destinationCity?._id ?? null,
      distance: distance,
      added_by: (findAirlineId?.airline_id as mongoose.Types.ObjectId) ?? null,
      stops: stops,
    };

    try {
      const newRoute = await routeModel
        .updateOne(
          { route_id: routeData.route_id },
          { $set: routeData },
          { upsert: true }
        )
        .exec();
      res.status(200).json({ add: 1, message: "Route Added!", data: newRoute });
    } catch (e) {
      res.status(400).json({ add: 0, error: 1, error_desc: e });
    }

  } else {
    res.status(400).json({ add: 0, error: 1, error_desc: valid["error"] });
  }
};

export const getRouteDetails = async (req: Request, res: Response) => {
  let token: any = req.headers.token;

  let decode: JwtPayload = <JwtPayload>jwt.decode(token);
  let findUser = await userModel.findOne({ email: decode.email }).exec();

  const findAirlineId = await airlineAdminModel
    .findOne({
      user_id: findUser?._id,
    })
    .exec();

  const findAdminAirline = await airlineModel
    .findOne({
      airline_code: process.env.ADMN_CODE,
    })
    .exec();

  const data = await routeModel
    .find(
      {
        added_by: { $in: [findAirlineId?.airline_id, findAdminAirline?._id] },
      },
      { __v: 0, createdAt: 0, updatedAt: 0, _id: 0 }
    )
    .populate({path : "added_by", select : "-_id -__v -createdAt -updatedAt"})
    .populate({ path: "source_city", select: "-_id -__v" })
    .populate({ path: "destination_city", select: "-_id -__v" })
    .populate({ path: "stops", select: "-_id -__v" })
    .exec();
  res.status(200).send(data);
};

