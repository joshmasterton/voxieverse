import express from 'express';
import { authenticate } from '../../middleware/authenticate.middleware.js';
import { validator } from '../../middleware/validator.middleware.js';
import { multerMiddleware } from '../../middleware/multer.middleware.js';
import { getPostsCommentsController } from '../../controller/postComment/getPostsComments.controller.js';
import { query } from 'express-validator';
export const getPostsComments = () => {
    const router = express.Router();
    router.get('/getPostsComments', authenticate, multerMiddleware, query('type_id').optional().toInt().isInt().withMessage('type_id required'), query('type')
        .trim()
        .escape()
        .isString()
        .notEmpty()
        .withMessage('type required')
        .isLength({ max: 10 })
        .withMessage('Exceeded max length'), query('post_parent_id')
        .optional()
        .toInt()
        .isInt()
        .withMessage('post_parent_id required'), query('comment_parent_id')
        .optional()
        .toInt()
        .isInt()
        .withMessage('comment_parent_id required'), query('profile_id').optional().toInt().isInt().withMessage('page required'), query('page').optional().toInt().isInt().withMessage('page required'), query('sort')
        .optional()
        .trim()
        .escape()
        .isString()
        .notEmpty()
        .isLength({ max: 10 })
        .withMessage('Exceeded max length'), validator, async (req, res) => await getPostsCommentsController(req, res));
    return router;
};
