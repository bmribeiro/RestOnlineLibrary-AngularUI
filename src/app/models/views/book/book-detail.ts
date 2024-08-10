import { Book } from "./book";
import { RentalUsers } from "./rental-users";

export interface BookDetail {

    booksView: Book;
    rentalUsers: RentalUsers[];
  }
  