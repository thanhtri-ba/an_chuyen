export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  avatar?: string;
  profile?: {
    address?: string;
    dob?: string;
    idCard?: string;
    emergencyPhone?: string;
    nationality?: string;
    occupation?: string;
  };
  wallet?: { balance: number };
  loyalty?: { points: number; tier: string };
  _count?: { bookings: number };
}
