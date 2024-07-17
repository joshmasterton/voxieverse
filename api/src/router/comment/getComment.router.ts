import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../../middleware/authenticate.middleware';
import { validator } from '../../middleware/validator.middleware';
import { getCommentController } from '../../controller/comment/getComment.controller';

export const getComment = () => {
  const router = express.Router();

  router.get(
    '/getComment',
    authenticate,
    query('comment_id')
      .notEmpty()
      .withMessage('comment_id required')
      .toInt()
      .isInt(),
    validator,
    async (req: Request, res: Response) => await getCommentController(req, res)
  );

  return router;
};
