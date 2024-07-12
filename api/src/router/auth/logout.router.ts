import express from 'express';
import { logoutController } from '../../controller/auth/logout.controller';
import { authenticate } from '../../middleware/authenticate.middleware';

export const logout = () => {
  const router = express.Router();

  router.get(
    '/logout',
    authenticate,
    async (req, res) => await logoutController(req, res)
  );

  return router;
};
