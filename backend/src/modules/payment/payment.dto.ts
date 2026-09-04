export enum PaymentMethod {
  COD = 'COD',
  VNPAY = 'VNPAY',
  STRIPE = 'STRIPE',
  WALLET = 'WALLET',
  MOMO = 'MOMO'
}

// Mirrors the live Postgres "PaymentStatus" enum (backend/prisma/schema.prisma).
export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface CreatePaymentDTO {
  bookingId: string;
  method: PaymentMethod;
  // amount is intentionally absent: it is always derived server-side from
  // the booking's own totalAmount, never accepted from the client.
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
