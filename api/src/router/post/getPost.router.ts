import express, { Request, Response } from 'express';
import { getPostController } from '../../controller/post/getPost.controller';
import { query } from 'express-validator';
import { authenticate } from '../../middleware/authenticate.middleware';
import { validator } from '../../middleware/validator.middleware';

export const getPost = () => {
  const router = express.Router();

  router.get(
    '/getPost',
    authenticate,
    query('post_id').notEmpty().withMessage('post_id required').toInt().isInt(),
    validator,
    async (req: Request, res: Response) => await getPostController(req, res)
  );

  return router;
};
