export interface UserRental {

  id: number;
  title: string;
  category: string;
  
  rentalStatus: string;
  rentalAt: Date;
  rentalStatusChangedAt: Date;
}
