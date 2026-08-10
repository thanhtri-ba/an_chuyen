import { Request, Response, NextFunction } from 'express';
import { logger } from '../core/logger';
import { getRequestContext } from '../core/async-context';

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  const context = getRequestContext();
  
  logger.error('request_failed', {
    errorName: err.name,
    errorMessage: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
    stack: err.stack,
    requestId: req.headers['x-request-id'] || 'unknown',
  });
}