import { Reservation } from "./reservation";

export interface Book {
  id?: number;
  title: string;
  category: string;
  copies: number;
  available: boolean;
  reservations: Reservation[] ;
}
