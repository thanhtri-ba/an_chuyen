// Mirrors the live Postgres "BookingStatus" enum (backend/prisma/schema.prisma).
// Note: booking.status values are DRAFT/PENDING_PAYMENT/CONFIRMED/COMPLETED/CANCELLED/REFUNDING/REFUNDED —
// there is no 'PAID' booking status. Payment success is represented by CONFIRMED (paid, upcoming trip)
// or COMPLETED (paid, trip finished).
export const PAID_STATUSES = ['CONFIRMED', 'COMPLETED'];

export const isPaidBooking = (status: string) => PAID_STATUSES.includes(status);

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'var(--color-text-muted)',
  PENDING_PAYMENT: 'var(--color-warning)',
  CONFIRMED: 'var(--color-success)',
  COMPLETED: 'var(--color-info)',
  CANCELLED: 'var(--color-danger)',
  REFUNDING: 'var(--color-warning)',
  REFUNDED: 'var(--color-text-muted)'
};

export const bookingStatusColor = (status: string) => STATUS_COLORS[status] || 'var(--color-text-muted)';
