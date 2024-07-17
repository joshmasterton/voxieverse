import express from 'express';
import { check } from 'express-validator';
import { validator } from '../../middleware/validator.middleware';
import { multerMiddleware } from '../../middleware/multer.middleware';
import { createPostController } from '../../controller/post/createPost.controller';
import { authenticate } from '../../middleware/authenticate.middleware';

export const createPost = () => {
  const router = express.Router();

  router.post(
    '/createPost',
    authenticate,
    multerMiddleware,
    check('post')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('Post cannot be empty')
      .isLength({ max: 500 })
      .withMessage('Exceeded max length'),
    validator,
    (req, res) => createPostController(req, res)
  );

  return router;
};
