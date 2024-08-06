export interface AvailableBook {
  id: number;
  title: string;
  category: string;
  copies: number;
  available: boolean;
  userHasRented: boolean;
}
