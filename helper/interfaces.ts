import mongoose from "mongoose";


export interface FileParams {
  Bucket: string;
  Key: string;
  Body: string;
  ContentType: string;
}

export interface SeatAvalibility {
  date: Date;
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

export interface Timing {
  source_time: Date;
  destination_time: Date;
}

export interface BookedSeats {
  date: Date;
  BC: Array<string>;
  EC: Array<string>;
  PE: Array<string>;
  FC: Array<string>;
}

export interface FlightBase {
  flight_no: string;
  airline_id: mongoose.Types.ObjectId | null;
  route_id: mongoose.Types.ObjectId | null;
  airbus_id: mongoose.Types.ObjectId | null;
  fare: mongoose.Types.ObjectId | null;
  status: number;
  timing?: Array<Timing>;
  available_seats?: Array<SeatAvalibility>;
  booked_seats?: Array<BookedSeats>;
  rule: mongoose.Types.ObjectId | null;
}

export interface RouteBase {
  route_id: string;
  source_city: mongoose.Types.ObjectId | null;
  destination_city: mongoose.Types.ObjectId | null;
  stops: Array<mongoose.Types.ObjectId | null>;
  added_by: mongoose.Types.ObjectId | null;
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

export interface Offer {
  offer_name: string;
  referal_code: string;
  offer_discount: number;
  valid_till: Date;
  promo: boolean;
  description: string;
}

export interface AddOn {
  type: number;
  name: string;
  icon?: string;
  limit?: number;
  price: number;
}

export interface PaymentDetails {
  basic_total: number;
  tax_total: number;
  original_total: number;
  discount: number;
  promotion: number;
  total_add_on: number;
}

export interface PaymentBase {
  order_id: string;
  razor_pay_id: string;
  transaction_stamp: Date;
  user_id: mongoose.Types.ObjectId | null;
  status: number;
  payment_amount: PaymentDetails;
}

export interface SeatBase {
  seat_no: string;
  type: number;
  price: number | null;
}

export interface BookingData {
  booking_stamp: Date;
  PNR_no: number;
  user_id: mongoose.Types.ObjectId | null;
  class_type: number;
  ticket_email: string;
  status: number;
  jouerny_info: {
    departure_date: Date;
    return_date: Date | null;
    destination_city: mongoose.Types.ObjectId | null;
    source_city: mongoose.Types.ObjectId | null;
    departure_flight: mongoose.Types.ObjectId | null;
    return_flight: mongoose.Types.ObjectId | null;
    address : string,
    pincode : number,
    state : string,
    peoples: Array<{
      type: number;
      first_name: string;
      last_name: string;
      age: number;
      gender: string;
      seat_no: {
        seat_no: string;
        type: number;
        price: number;
      };
      rtn_seat_no: {
        seat_no: string;
        type: number;
        price: number;
      };
    }>;
    infants: Array<{
      first_name: string;
      last_name: string;
      age: number;
      gender: string;
    }>;
  };
  addons: {
    departure_addons: Array<AddOn>;
    return_addons: Array<AddOn>;
  };
  payment: mongoose.Types.ObjectId | null;
}
