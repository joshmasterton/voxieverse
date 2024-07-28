import express from 'express';
import { check } from 'express-validator';
import { validator } from '../../middleware/validator.middleware.js';
import { loginController } from '../../controller/auth/login.controller.js';
export const login = () => {
    const router = express.Router();
    router.post('/login', check('username')
        .trim()
        .escape()
        .isString()
        .notEmpty()
        .withMessage('Username required')
        .isLength({ min: 6 })
        .withMessage('Username must be at least 6 characters')
        .isLength({ max: 50 })
        .withMessage('Exceeded max length'), check('password')
        .trim()
        .escape()
        .isString()
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .isLength({ max: 100 })
        .withMessage('Exceeded max length'), validator, async (req, res) => await loginController(req, res));
    return router;
};
