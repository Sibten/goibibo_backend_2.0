import { Flightclass } from "./enums";

export const getFlightClass = (class_number: number): string => {
  switch (class_number) {
    case Flightclass.Business:
      return "Bussiness";
    case Flightclass.Economy:
      return "Economy";
    case Flightclass.FirstClass:
      return "First Class";
    case Flightclass.PremiumEconomy:
      return "Premium Economy";
    default:
      return "";
  }
};
