export interface Trip {
  id: string;
  company: string;
  type: string;
  depTime: string;
  arrTime: string;
  duration: string;
  from: string;
  to: string;
  pickupStation: string;
  dropoffStation: string;
  price: number;
  emptySeats: number;
  rating: number;
  reviews: number;
  promo: boolean;
  amenities: string[];
}
