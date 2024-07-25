import express from 'express';
import { check } from 'express-validator';
import { validator } from '../../middleware/validator.middleware.js';
import { signupController } from '../../controller/auth/signup.controller.js';
import { multerMiddleware } from '../../middleware/multer.middleware.js';
export const signup = () => {
  const router = express.Router();
  router.post(
    '/signup',
    multerMiddleware,
    check('username')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('Username required')
      .isLength({ min: 6 })
      .withMessage('Username must be at least 6 characters')
      .isLength({ max: 50 })
      .withMessage('Exceeded max length'),
    check('email')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Email required')
      .isEmail()
      .withMessage('Valid email required')
      .isLength({ max: 50 })
      .withMessage('Exceeded max length'),
    check('password')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('Password required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .isLength({ max: 100 })
      .withMessage('Exceeded max length'),
    check('confirmPassword')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('Confirm password required')
      .isLength({ min: 6 })
      .withMessage('Confirm password must be at least 6 characters')
      .isLength({ max: 100 })
      .withMessage('Exceeded max length'),
    validator,
    async (req, res) => await signupController(req, res)
  );
  return router;
};
