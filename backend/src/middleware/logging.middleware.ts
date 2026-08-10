import { Request, Response, NextFunction } from 'express';
import { logger } from '../core/logger';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  let logged = false;

  const logRequest = () => {
    if (logged) return;
    logged = true;

    const durationMs = Date.now() - startTime;
    const isHealthCheck = req.path === '/health';
    const isSuccess = res.statusCode >= 200 && res.statusCode < 400;

    const logData = {
      event: 'http_request_completed',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs,
    };

    if (isHealthCheck) {
      if (isSuccess) {
        // Suppress successful health check from info logs
        logger.debug('health_check', logData);
      } else {
        logger.warn('health_check_failed', logData);
      }
    } else {
      logger.info('http_request_completed', logData);
    }
  };

  res.on('finish', logRequest);
  res.on('close', logRequest);

  next();
}