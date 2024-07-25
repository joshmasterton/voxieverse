import express from 'express';
import { query } from 'express-validator';
import { getUserController } from '../../controller/user/getUser.controller.js';
import { authenticate } from '../../middleware/authenticate.middleware.js';
import { validator } from '../../middleware/validator.middleware.js';
export const getUser = () => {
  const router = express.Router();
  router.get(
    '/getUser',
    authenticate,
    query('user_id').toInt().isInt().withMessage('user_id required'),
    validator,
    async (req, res) => getUserController(req, res)
  );
  return router;
};
