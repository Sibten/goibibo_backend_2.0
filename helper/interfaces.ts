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
  status: number;
  timing: { source_time: string; destination_time: string };
  available_seats: { BC: number; EC: number; PE: number; FC: number };
  booked_seats: { BC: []; EC: []; PE: []; FC: [] };
}
