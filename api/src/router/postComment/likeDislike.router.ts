import express from 'express';
import { check } from 'express-validator';
import { likeDislikeController } from '../../controller/postComment/likeDislike.controller';
import { authenticate } from '../../middleware/authenticate.middleware';
import { validator } from '../../middleware/validator.middleware';

export const likeDislike = () => {
  const router = express.Router();

  router.put(
    '/likeDislike',
    authenticate,
    check('reaction')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('reaction required'),
    check('type')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('type required'),
    check('type_id').notEmpty().withMessage('type_id required').toInt().isInt(),
    validator,
    async (req, res) => await likeDislikeController(req, res)
  );

  return router;
};
