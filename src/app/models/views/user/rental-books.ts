import { Rental } from "../../rental";

export interface RentalBooks extends Rental {

  id: number;
  title: string;
  category: string;
}
