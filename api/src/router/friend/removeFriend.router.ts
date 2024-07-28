import express from 'express';
import { check } from 'express-validator';
import { authenticate } from '../../middleware/authenticate.middleware';
import { validator } from '../../middleware/validator.middleware';
import { removeFriendController } from '../../controller/friend/removeFriend.controller';

export const removeFriend = () => {
  const router = express.Router();

  router.delete(
    '/removeFriend',
    authenticate,
    check('friend_id').toInt().isInt().withMessage('friend_id required'),
    validator,
    async (req, res) => await removeFriendController(req, res)
  );

  return router;
};
