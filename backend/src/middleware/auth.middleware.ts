import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email?: string;
  };
}

export async function verifyAccessToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = req.headers.authorization;

  // Dev-only bypass: authenticates as the first DB user when no/invalid token.
  // Must be explicitly opted into per-environment; never active unless both
  // conditions hold, so it can't accidentally run in production.
  const devAuthFallbackEnabled =
    process.env.NODE_ENV === 'development' &&
    process.env.ALLOW_DEV_AUTH_FALLBACK === 'true';

  async function applyDevFallback(): Promise<void> {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const firstUser = await prisma.user.findFirst();
    req.user = {
      id: firstUser?.id || '00000000-0000-0000-0000-000000000000',
      role: firstUser?.role || 'user',
      email: firstUser?.email || 'test@example.com',
    };
  }

  if (!authorization?.startsWith('Bearer ')) {
    if (devAuthFallbackEnabled) {
      try {
        await applyDevFallback();
      } catch {
        req.user = { id: '00000000-0000-0000-0000-000000000000', role: 'user' };
      }
      return next();
    }
    res.status(401).json({
      message: 'Authentication required',
    });
    return;
  }

  const token = authorization.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: 'JWT configuration is missing' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload !== 'object' ||
      typeof payload.sub !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      res.status(401).json({
        message: 'Invalid access token',
      });
      return;
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
      email: typeof payload.email === 'string'
        ? payload.email
        : undefined,
    };

    next();
  } catch {
    if (devAuthFallbackEnabled) {
      try {
        await applyDevFallback();
      } catch {
        req.user = { id: '00000000-0000-0000-0000-000000000000', role: 'user' };
      }
      return next();
    }
    res.status(401).json({
      message: 'Invalid access token',
    });
  }
}
