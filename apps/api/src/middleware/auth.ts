import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

// Extend the Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Middleware to authenticate requests
export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'No authorization header' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  
  supabase.auth.getUser(token)
    .then(({ data: { user }, error }) => {
      if (error || !user) {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email!,
        role: user.role!,
      };

      next();
    })
    .catch((error) => {
      console.error('Auth error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    });
}

// Authorization middleware
export function authorize(roles: string[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void {
  return function authorizeMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}

// Rate limiting middleware
export function rateLimit(maxRequests: number, windowMs: number): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void {
  const requests = new Map<string, number[]>();

  return function rateLimitMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const now = Date.now();
    const userId = req.user?.id || req.ip || 'anonymous';

    // Get existing requests for this user
    const userRequests = requests.get(userId) || [];

    // Remove requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }

    // Add current request
    validRequests.push(now);
    requests.set(userId, validRequests);

    next();
  };
}
