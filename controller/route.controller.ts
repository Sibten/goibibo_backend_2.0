import { routeModel } from "../model/route.model";
import { Request, Response } from "express";
import { validateRoute } from "../validator/route.validate";
import node_geocoder from "node-geocoder";
import mongoose from "mongoose";
import { cityModel } from "../model/city.model";
import process = require("process");
import GeoPoint from "geopoint";

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

const finddistance = async (Source: string, Destination: string) => {
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

const findCity = async (id: mongoose.Types.ObjectId) => {
  const city = await cityModel.findById(id).exec();
  return city?.airport_name;
};

export const addRoute = async (req: Request, res: Response) => {
  let valid = validateRoute(req.body);
  if (!valid["error"]) {
    let sourceCity = await findCity(req.body.source_city);
    let destinationCity = await findCity(req.body.destination_city);
    const distance = await finddistance(sourceCity!, destinationCity!);
    req.body.distance = distance;

    const newRoute = new routeModel(req.body);
    await newRoute.save();

    res.status(200).json({ add: 1, message: "Route Added!" });
  } else {
    res.status(400).json({ add: 0, error: 1, error_desc: valid["error"] });
  }
};

export const getRouteDetails = async (req: Request, res: Response) => {
  const data = await routeModel
    .find({})
    .populate("source_city")
    .populate("destination_city")
    .exec();
  res.status(200).send(data);
};
