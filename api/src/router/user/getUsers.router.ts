import express from 'express';
import { query } from 'express-validator';
import { authenticate } from '../../middleware/authenticate.middleware';
import { validator } from '../../middleware/validator.middleware';
import { getUsersController } from '../../controller/user/getUsers.controller';

export const getUsers = () => {
  const router = express.Router();

  router.get(
    '/getUsers',
    authenticate,
    query('search')
      .optional()
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .isLength({ max: 500 })
      .withMessage('Exceeded max length'),
    query('friends')
      .optional()
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .withMessage('Friend status required')
      .isLength({ max: 500 })
      .withMessage('Exceeded max length'),
    query('page').optional().toInt().isInt().withMessage('page required'),
    query('sort')
      .optional()
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .isLength({ max: 10 })
      .withMessage('Exceeded max length'),
    validator,
    async (req, res) => getUsersController(req, res)
  );

  return router;
};
