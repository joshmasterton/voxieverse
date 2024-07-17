import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../../middleware/authenticate.middleware';

export const getComments = () => {
  const router = express.Router();

  router.get(
    '/getComments',
    authenticate,
    query('page').optional().toInt().isInt(),
    async (req: Request, res: Response) => await getCommentsController(req, res)
  );

  return router;
};
