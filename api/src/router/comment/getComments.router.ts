import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../../middleware/authenticate.middleware';
import { getCommentsController } from '../../controller/comment/getComments.controller';

export const getComments = () => {
  const router = express.Router();

  router.get(
    '/getComments',
    authenticate,
    query('page').optional().toInt().isInt(),
    query('post_id').toInt().isInt().withMessage('post_id required'),
    query('comment_parent_id')
      .optional()
      .toInt()
      .isInt()
      .withMessage('comment_parent_id required'),
    async (req: Request, res: Response) => await getCommentsController(req, res)
  );

  return router;
};
