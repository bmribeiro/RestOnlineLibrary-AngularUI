import { Rental } from "../../rental";

export interface RentalUsers extends Rental {

  id: number;
  username: string;
}
