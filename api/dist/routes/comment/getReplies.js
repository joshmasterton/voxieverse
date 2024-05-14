import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken.js';
import {queryDb} from '../../database/queryDb.js';
export const getReplies = express.Router();
getReplies.get('/:commentId/:sort/:page', verifyToken, body('commentId')
	.escape()
	.trim(), body('sort')
	.escape()
	.trim(), body('page')
	.escape()
	.trim(), async (req, res) => {
	try {
		const {commentId, sort, page} = req.params;
		const offset = parseInt(page, 10) * 100;
		const validator = validationResult(req).array();
		if (validator.length > 0) {
			const validationError = validator[0].msg;
			return res.status(200).json({validationError});
		}

		const repliesFromDatabase = await queryDb(`
				SELECT * FROM voxieverse_comments
				WHERE comment_parent_id = $1
				ORDER BY ${sort} DESC LIMIT $2 OFFSET $3;
			`, [parseInt(commentId, 10), 100, offset]);
		const childcomments = repliesFromDatabase?.rows;
		const refinedRepliesPomises = childcomments.map(async childComment => {
			const likedResult = await queryDb(`
					SELECT * FROM voxieverse_comment_likes
					WHERE username = $1 AND comment_id = $2;
				`, [res.locals.user.username, childComment.id]);
			const dislikedResult = await queryDb(`
					SELECT * FROM voxieverse_comment_dislikes
					WHERE username = $1 AND comment_id = $2;
				`, [res.locals.user.username, childComment.id]);
			return {
				id: childComment.id,
				postId: childComment.post_id,
				commentParentId: childComment.comment_parent_id,
				username: childComment.username,
				comment: childComment.comment,
				likes: childComment.likes,
				hasLiked: Boolean(likedResult?.rows[0]),
				dislikes: childComment.dislikes,
				hasDisliked: Boolean(dislikedResult?.rows[0]),
				comments: childComment.comments,
				childComments: [],
				createdAt: new Date(childComment.created_at).toLocaleString(),
			};
		});
		const refinedReplies = await Promise.all(refinedRepliesPomises);
		return res.json(refinedReplies);
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({error: err.message});
		}
	}
});
