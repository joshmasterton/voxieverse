import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { getPostsController } from '../../controller/post/getPosts.controller.';
import { authenticate } from '../../middleware/authenticate.middleware';

export const getPosts = () => {
  const router = express.Router();

  router.get(
    '/getPosts',
    authenticate,
    query('page').optional().toInt().isInt(),
    async (req: Request, res: Response) => await getPostsController(req, res)
  );

  return router;
};
