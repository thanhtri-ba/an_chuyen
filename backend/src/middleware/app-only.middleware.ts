import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware to restrict access to only mobile application clients.
 * Expects a custom header 'x-client-platform' with the value 'mobile'.
 */
export function restrictToApp(req: Request, res: Response, next: NextFunction): void {
  const clientPlatform = req.headers['x-client-platform'];

  if (clientPlatform === 'mobile') {
    next();
  } else {
    res.status(403).json({
      message: 'Access forbidden. This resource is only accessible from the mobile app.',
    });
  }
}
