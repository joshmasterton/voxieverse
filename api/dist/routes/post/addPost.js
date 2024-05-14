import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken.js';
import {queryDb} from '../../database/queryDb.js';
export const addPost = express.Router();
addPost.post('/', verifyToken, body('post')
	.isLength({min: 1})
	.withMessage('Post cannot be empty')
	.isLength({max: 500})
	.withMessage('Cannot exceed 500 characters')
	.escape()
	.trim(), async (req, res) => {
	if (!req.body) {
		return res.status(400).json({error: 'Request body missing'});
	}

	const {post} = req.body;
	const {user} = res.locals;
	const validator = validationResult(req).array();
	if (validator.length > 0) {
		const validationError = validator[0].msg;
		return res.status(200).json({validationError});
	}

	if (!post.trim()) {
		return res.status(200).json({validationError: 'Cannot be empty'});
	}

	try {
		await queryDb(`
				INSERT INTO voxieverse_posts(
					username,
					post
				)VALUES(
					$1, $2
				);
			`, [user.username, post]);
		return res.json({message: 'Post sent successfully'});
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({error: err.message});
		}
	}
});
