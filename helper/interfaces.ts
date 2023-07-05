import mongoose from "mongoose";

export interface FileParams {
  Bucket: string;
  Key: string;
  Body: string;
  ContentType: string;
}

export interface SeatAvalibility {
  BC: number;
  EC: number;
  PE: number;
  FC: number;
}

export interface ClassMap {
  class_type?: number;
  row_start?: number;
  row_end?: number;
  col_start?: string;
  col_gap?: string;
  col_end?: string;
}

export interface AirBusBase {
  airbus_code: string;
  available_class: { BC: boolean; EC: boolean; PE: boolean; FC: boolean };
  seat_map: [ClassMap];
}

export interface FlightBase {
  flight_no: string;
  airline_id: mongoose.Types.ObjectId | null;
  route_id: mongoose.Types.ObjectId | null;
  airbus_id: mongoose.Types.ObjectId | null;
  fare: mongoose.Types.ObjectId | null;
  status: number;
  timing: { source_time: Date; destination_time: Date };
  available_seats: { BC: number; EC: number; PE: number; FC: number };
  booked_seats: { BC: []; EC: []; PE: []; FC: [] };
  rule : mongoose.Types.ObjectId | null;
}

export interface RouteBase {
  route_id: string;
  source_city: mongoose.Types.ObjectId | null;
  destination_city: mongoose.Types.ObjectId | null;
  stops: Array<mongoose.Types.ObjectId | null>;
  distance: number;
}
interface ClassFare {
  class_type: number;
  basic_fare: number;
}
export interface FareBase {
  airline_id: mongoose.Types.ObjectId | null;
  fare: Array<ClassFare>;
  tax: number;
}
interface Luggage {
  type: number;
  limit: number;
}

export interface RuleBase {
  airline_id: mongoose.Types.ObjectId | null;
  luggage: Array<Luggage>;
}