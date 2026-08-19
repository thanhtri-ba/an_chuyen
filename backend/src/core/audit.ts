import { logger } from './logger';

export type AuditEvent =
  | 'BookingCreated'
  | 'PaymentConfirmed'
  | 'TicketIssued'
  | 'AdminUserUpdated'
  | 'WalletAdjusted';

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