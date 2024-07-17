import express from 'express';
import { check } from 'express-validator';
import { validator } from '../../middleware/validator.middleware';
import { authenticate } from '../../middleware/authenticate.middleware';
import { createCommentController } from '../../controller/comment/createComment.controller';

export const createComment = () => {
  const router = express.Router();

  router.post(
    '/createComment',
    authenticate,
    check('comment_parent_id').trim().escape().toInt().isInt().optional(),
    check('post_id')
      .trim()
      .escape()
      .toInt()
      .isInt()
      .withMessage('post_id required'),
    check('comment')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('Comment cannot be empty')
      .isLength({ max: 500 })
      .withMessage('Exceeded max length'),
    validator,
    (req, res) => createCommentController(req, res)
  );

  return router;
};
