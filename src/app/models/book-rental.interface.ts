export interface BookRental {
    id: number;
    title: string;
    category: string;
    reservedAt: Date;
    status: string;
    statusChangedAt: Date;
}