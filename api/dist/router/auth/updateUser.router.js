import express from 'express';
import { check } from 'express-validator';
import { multerMiddleware } from '../../middleware/multer.middleware.js';
import { validator } from '../../middleware/validator.middleware.js';
import { updateUserController } from '../../controller/auth/updateUser.controller.js';
import { authenticate } from '../../middleware/authenticate.middleware.js';
export const updateUser = () => {
    const router = express.Router();
    router.post('/updateUser', authenticate, multerMiddleware, check('username')
        .optional()
        .trim()
        .escape()
        .isString()
        .notEmpty()
        .withMessage('Username required')
        .isLength({ min: 6 })
        .withMessage('Username must be at least 6 characters')
        .isLength({ max: 50 })
        .withMessage('Exceeded max length'), check('email')
        .optional()
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Valid email required')
        .isLength({ max: 50 })
        .withMessage('Exceeded max length'), check('password')
        .optional()
        .trim()
        .escape()
        .isString()
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .isLength({ max: 100 })
        .withMessage('Exceeded max length'), check('confirmPassword')
        .optional()
        .trim()
        .escape()
        .isString()
        .notEmpty()
        .withMessage('Confirm password required')
        .isLength({ min: 6 })
        .withMessage('Confirm password must be at least 6 characters')
        .isLength({ max: 100 })
        .withMessage('Exceeded max length'), validator, async (req, res) => await updateUserController(req, res));
    return router;
};
