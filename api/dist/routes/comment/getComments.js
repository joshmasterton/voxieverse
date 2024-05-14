import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken.js';
import {queryDb} from '../../database/queryDb.js';
export const getComments = express.Router();
getComments.get('/:postId/:sort/:page', verifyToken, body('postId')
	.escape()
	.trim(), body('sort')
	.escape()
	.trim(), body('page')
	.escape()
	.trim(), async (req, res) => {
	try {
		const {postId, sort, page} = req.params;
		const offset = parseInt(page, 10) * 100;
		const validator = validationResult(req).array();
		if (validator.length > 0) {
			const validationError = validator[0].msg;
			return res.status(200).json({validationError});
		}

		const commentsFromDatabase = await queryDb(`
				SELECT * FROM voxieverse_comments
				WHERE post_id = $1
				ORDER BY ${sort} DESC LIMIT $2 OFFSET $3;
			`, [parseInt(postId, 10), 100, offset]);
		const comments = commentsFromDatabase?.rows;
		const refinedCommentsPomises = comments.map(async comment => {
			const likedResult = await queryDb(`
					SELECT * FROM voxieverse_comment_likes
					WHERE username = $1 AND comment_id = $2;
				`, [res.locals.user.username, comment.id]);
			const dislikedResult = await queryDb(`
					SELECT * FROM voxieverse_comment_dislikes
					WHERE username = $1 AND comment_id = $2;
				`, [res.locals.user.username, comment.id]);
			return {
				id: comment.id,
				postId: comment.post_id,
				commentParentId: comment.comment_parent_id,
				username: comment.username,
				comment: comment.comment,
				likes: comment.likes,
				hasLiked: Boolean(likedResult?.rows[0]),
				dislikes: comment.dislikes,
				hasDisliked: Boolean(dislikedResult?.rows[0]),
				comments: comment.comments,
				childComments: [],
				createdAt: new Date(comment.created_at).toLocaleString(),
			};
		});
		const refinedComments = await Promise.all(refinedCommentsPomises);

		const nestComments = (comments, parentId = null) => comments
			.filter(comment => comment.commentParentId === parentId)
			.map(comment => {
				const nestedComments = nestComments(comments, comment.id);
				return {...comment, childComments: nestedComments};
			});
		const nestedComments = nestComments(refinedComments);
		return res.json(nestedComments);
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({error: err.message});
		}
	}
});
