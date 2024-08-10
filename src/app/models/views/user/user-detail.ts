import { RentalBooks } from "./rental-books";
import { User } from "./user";

export interface UserDetail {

    userView: User;
    rentalBooks: RentalBooks[];
  }
  