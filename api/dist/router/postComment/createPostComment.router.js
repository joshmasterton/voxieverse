import express from 'express';
import { authenticate } from '../../middleware/authenticate.middleware.js';
import { check } from 'express-validator';
import { validator } from '../../middleware/validator.middleware.js';
import { multerMiddleware } from '../../middleware/multer.middleware.js';
import { createPostCommentController } from '../../controller/postComment/createPostComment.controller.js';
export const createPostComment = () => {
    const router = express.Router();
    router.post('/createPostComment', authenticate, multerMiddleware, check('type')
        .trim()
        .escape()
        .isString()
        .notEmpty()
        .withMessage('type required')
        .isLength({ max: 10 })
        .withMessage('Exceeded max length'), check('post_parent_id')
        .optional()
        .toInt()
        .isInt()
        .withMessage('post_parent_id required'), check('comment_parent_id')
        .optional()
        .toInt()
        .isInt()
        .withMessage('comment_parent_id required'), check('text')
        .trim()
        .escape()
        .isString()
        .notEmpty()
        .withMessage('Cannot be empty')
        .isLength({ max: 500 })
        .withMessage('Exceeded max length'), validator, async (req, res) => await createPostCommentController(req, res));
    return router;
};
