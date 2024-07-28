import express from 'express';
import { check } from 'express-validator';
import { authenticate } from '../../middleware/authenticate.middleware';
import { validator } from '../../middleware/validator.middleware';
import { addFriendController } from '../../controller/friend/addFriend.controller';

export const addFriend = () => {
  const router = express.Router();

  router.post(
    '/addFriend',
    authenticate,
    check('friend_id').toInt().isInt().withMessage('friend_id required'),
    validator,
    async (req, res) => await addFriendController(req, res)
  );

  return router;
};
