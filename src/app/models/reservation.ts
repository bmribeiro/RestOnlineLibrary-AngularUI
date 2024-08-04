import { AuthUser } from "./auth_user";
import { Book } from "./book";

export interface Reservation {
    id: number | null;
    user: AuthUser | number;
    book: Book | number;
    reservedAt: string | null,
    status: string | null,
    statusChangedAt: string | null
}