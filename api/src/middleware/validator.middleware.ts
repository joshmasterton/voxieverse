import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validator = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array()[0].msg });
  }

  next();
};
