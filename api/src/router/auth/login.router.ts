import express from 'express';
import { check } from 'express-validator';
import { validator } from '../../middleware/validator.middleware';
import { signupController } from '../../controller/auth/signup.controller';
import multer from 'multer';

const upload = multer();

export const login = () => {
  const router = express.Router();

  router.post(
    '/login',
    upload.single('profilePicture'),
    check('username')
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .withMessage('Username required')
      .isLength({ min: 6 })
      .withMessage('Username must be at least 6 characters')
      .isLength({ max: 50 })
      .withMessage('Exceeded max length'),
    check('password')
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .withMessage('Password required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .isLength({ max: 100 })
      .withMessage('Exceeded max length'),
    validator,
    async (req, res) => await signupController(req, res)
  );

  return router;
};
