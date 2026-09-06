import { logger } from './logger';

export type AuditEvent =
  | 'BookingCreated'
  | 'BookingCancelled'
  | 'PaymentConfirmed'
  | 'TicketIssued'
  | 'AdminUserUpdated'
  | 'WalletAdjusted'
  | 'OtpRequested'
  | 'OtpVerified'
  | 'OtpFailed'
  | 'CustomerIdCardViewed'
  | 'CustomerIdCardEdited'
  | 'RefundProcessed'
  | 'GuestSessionCreated'
  | 'OrderLookupSucceeded'
  | 'OrderLookupFailed';

export interface AuditEntry {
  event: AuditEvent;
  actorId: string;
  actorRole: string;
  resourceType: string;
  resourceId: string;
  outcome: 'success' | 'failure';
  metadata?: Record<string, string | number | boolean | null>;
}

export function auditLog(entry: AuditEntry) {
  logger.info(entry.event, {
    category: 'audit',
    ...entry,
  });
}