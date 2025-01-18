import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = jest.fn((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  req.user = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    role: 'user',
  };
  next();
});

export const authorize = jest.fn((roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (roles.includes(req.user?.role || '')) {
      next();
    } else {
      res.status(403).json({ error: 'Unauthorized' });
    }
  };
});
