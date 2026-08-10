import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from './auth.middleware';

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication required',
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      error: 'Admin permission required',
    });
    return;
  }

  next();
}
