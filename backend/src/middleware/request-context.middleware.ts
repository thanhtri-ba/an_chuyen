import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import * as Sentry from '@sentry/node';
import { asyncContext } from '../core/async-context';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header('x-correlation-id');
  
  const correlationId =
    incoming && UUID_PATTERN.test(incoming)
      ? incoming
      : randomUUID();

  const requestId = randomUUID();

  asyncContext.run({ requestId, correlationId }, () => {
    Sentry.setTag('request_id', requestId);
    Sentry.setTag('correlation_id', correlationId);
    next();
  });
}