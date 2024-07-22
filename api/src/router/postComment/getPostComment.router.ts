import express from 'express';
import { authenticate } from '../../middleware/authenticate.middleware';
import { validator } from '../../middleware/validator.middleware';
import { multerMiddleware } from '../../middleware/multer.middleware';
import { getPostCommentController } from '../../controller/postComment/getPostComment.controller';
import { query } from 'express-validator';

export const getPostComment = () => {
  const router = express.Router();

  router.get(
    '/getPostComment',
    authenticate,
    multerMiddleware,
    query('type_id').toInt().isInt().withMessage('type_id required'),
    query('type')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('type required')
      .isLength({ max: 10 })
      .withMessage('Exceeded max length'),
    query('post_parent_id')
      .optional()
      .toInt()
      .isInt()
      .withMessage('post_parent_id required'),
    query('comment_parent_id')
      .optional()
      .toInt()
      .isInt()
      .withMessage('comment_parent_id required'),
    validator,
    async (req, res) => await getPostCommentController(req, res)
  );

  return router;
};
