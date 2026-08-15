export enum PaymentMethod {
  COD = 'COD',
  VNPAY = 'VNPAY',
  STRIPE = 'STRIPE',
  WALLET = 'WALLET',
  MOMO = 'MOMO'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export interface CreatePaymentDTO {
  bookingId: string;
  method: PaymentMethod;
  amount: number;
  currency?: string;
  description?: string;
}

export interface UpdatePaymentDTO {
  status?: PaymentStatus;
  transactionId?: string;
  paymentUrl?: string;
  errorCode?: string;
  confirmedBy?: string;
}

export interface PaymentResponseDTO {
  id: string;
  bookingId: string;
  method: string;
  status: string;
  amount: number;
  currency: string;
  transactionId?: string;
  paymentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfirmPaymentDTO {
  paymentId: string;
  adminEmail: string;
  notes?: string;
}
