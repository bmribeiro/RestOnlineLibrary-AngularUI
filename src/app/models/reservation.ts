import { AuthUser } from "./auth_user";
import { Book } from "./views/book/book";

export interface Reservation {
    id: number | null;
    user: AuthUser;
    book: Book;
}