import express from 'express';
import { query } from 'express-validator';
import { authenticate } from '../../middleware/authenticate.middleware';
import { validator } from '../../middleware/validator.middleware';
import { getFriendController } from '../../controller/friend/getFriend.controller';

export const getFriend = () => {
  const router = express.Router();

  router.get(
    '/getFriend',
    authenticate,
    query('friend_id').toInt().isInt().withMessage('friend_id required'),
    validator,
    async (req, res) => await getFriendController(req, res)
  );

  return router;
};
