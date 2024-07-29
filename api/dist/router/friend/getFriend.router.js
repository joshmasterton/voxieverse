import express from 'express';
import { query } from 'express-validator';
import { authenticate } from '../../middleware/authenticate.middleware.js';
import { validator } from '../../middleware/validator.middleware.js';
import { getFriendController } from '../../controller/friend/getFriend.controller.js';
export const getFriend = () => {
    const router = express.Router();
    router.get('/getFriend', authenticate, query('friend_id').toInt().isInt().withMessage('friend_id required'), validator, async (req, res) => await getFriendController(req, res));
    return router;
};
