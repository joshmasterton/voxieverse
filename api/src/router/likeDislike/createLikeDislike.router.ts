import express from 'express';
import { authenticate } from '../../middleware/authenticate.middleware';
import { check } from 'express-validator';
import { validator } from '../../middleware/validator.middleware';
import { createLikeDislikeController } from '../../controller/likeDislike/createLikeDislike.controller';

export const likeDislike = () => {
  const router = express.Router();

  router.post(
    '/likeDislike',
    authenticate,
    check('type')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('type required')
      .isLength({ max: 10 })
      .withMessage('Exceeded max length'),
    check('type_id').toInt().isInt().withMessage('post_parent_id required'),
    check('reaction')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('Cannot be empty')
      .isLength({ max: 10 })
      .withMessage('Exceeded max length'),
    validator,
    async (req, res) => await createLikeDislikeController(req, res)
  );

  return router;
};
