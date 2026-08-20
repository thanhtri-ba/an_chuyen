export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

export interface BookingData {
  tripScheduleId?: string;
  seats: string[];
  seatsTotal: number;
  pickupPoint?: string;
  dropoffPoint?: string;
  pickupLabel: string;
  dropoffLabel: string;
  routeLabel: string;
  busAgentName: string;
  addInsurance: boolean;
  insurancePrice: number;
  needVAT: boolean;
  notes?: string;
  passengerInfo: ContactInfo;
  bookerInfo: ContactInfo;
  totalAmount?: number;
}

export interface Booking {
  id: string;
  createdAt: string;
  status: string;
  seatNumbers?: string[];
  totalAmount: number;
  paymentStatus: string;
  tripSchedule?: {
    departureTime: string;
    arrivalTime: string;
    trip?: {
      busAgent?: {
        name: string;
      };
      route?: {
        departureCity?: {
          name: string;
        };
        arrivalCity?: {
          name: string;
        };
      };
    };
  };
}

export interface BookingConfirmation {
  bookingId: string;
  passengerName: string;
  routeLabel: string;
  busAgentName?: string;
  seats: string[];
  totalAmount: number;
  createdAt: string;
}
