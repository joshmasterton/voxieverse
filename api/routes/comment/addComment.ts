import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken';
import {queryDb} from '../../database/queryDb';

type Comment = {
	comment: string;
	postId: number;
	commentParentId: number;
};

export const addComment = express.Router();

addComment.post(
	'/',
	verifyToken,
	body('comment')
		.isLength({min: 1})
		.withMessage('Comment cannot be empty')
		.isLength({max: 500})
		.withMessage('Cannot exceed 500 characters')
		.escape()
		.trim(),
	async (req, res) => {
		if (!req.body) {
			return res.status(400).json({error: 'Request body missing'});
		}

		const {comment, postId, commentParentId}: Comment = req.body as Comment;
		const {user} = res.locals;
		const validator = validationResult(req).array();

		if (validator.length > 0) {
			const validationError: string = validator[0].msg as string;
			return res.status(200).json({validationError});
		}

		if (!comment.trim()) {
			return res.status(200).json({validationError: 'Cannot be empty'});
		}

		try {
			await queryDb<string>(`
				INSERT INTO voxieverse_comments(
					post_id,
					comment_parent_id,
					username,
					comment
				)VALUES(
					$1, $2, $3, $4
				);
			`, [postId, commentParentId ?? null, user.username, comment]);

			await queryDb(`
				UPDATE voxieverse_posts
				SET comments = comments + 1
				WHERE id = $1
			`, [postId]);

			if (commentParentId !== null) {
				await queryDb(`
          UPDATE voxieverse_comments
          SET comments = comments + 1
          WHERE id = $1;
        `, [commentParentId]);
			}

			return res.json({message: 'Comment added successfully'});
		} catch (err) {
			if (err instanceof Error) {
				return res.status(500).json({error: err.message});
			}
		}
	},
);
