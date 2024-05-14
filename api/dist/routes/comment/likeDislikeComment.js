import express from 'express';
import {body, validationResult} from 'express-validator';
import {queryDb} from '../../database/queryDb.js';
import {verifyToken} from '../../token/verifyToken.js';
export const likeDislikeComment = express.Router();
likeDislikeComment.put('/', verifyToken, body('commentId')
	.escape()
	.trim(), body('action')
	.escape()
	.trim(), async (req, res) => {
	try {
		const validator = validationResult(req).array();
		const {commentId, action} = req.body;
		const {user} = res.locals;
		if (validator.length > 0) {
			const validationError = validator[0].msg;
			return res.status(200).json({validationError});
		}

		// Has user already liked or disliked post
		const existingInteraction = await queryDb(`
				SELECT * FROM voxieverse_comment_${action}s
				WHERE username = $1 AND comment_id = $2
			`, [user.username, commentId]);
		// If so delete relation
		if (existingInteraction?.rows[0]) {
			await queryDb(`
					DELETE FROM voxieverse_comment_${action}s
					WHERE username = $1 AND comment_id = $2
				`, [user.username, commentId]);
			await queryDb(`
					UPDATE voxieverse_comments
					SET ${action}s = ${action}s - 1
					WHERE id = $1;
				`, [commentId]);
		} else {
			// Check if user disliked a liked post and vice versa
			const existingLikeOrDislike = await queryDb(`
					SELECT * FROM voxieverse_comment_${action === 'like' ? 'dislike' : 'like'}s
					WHERE username = $1 AND comment_id = $2
				`, [user.username, commentId]);
			// If so delete relation
			if (existingLikeOrDislike?.rows[0]) {
				await queryDb(`
						DELETE FROM voxieverse_comment_${action === 'like' ? 'dislike' : 'like'}s
						WHERE username = $1 AND comment_id = $2
					`, [user.username, commentId]);
				await queryDb(`
						UPDATE voxieverse_comments
						SET ${action === 'like' ? 'dislike' : 'like'}s = ${action === 'like' ? 'dislike' : 'like'}s - 1
						WHERE id = $1;
					`, [commentId]);
			}

			// Insert new like or dislike to post
			await queryDb(`
					INSERT INTO voxieverse_comment_${action}s(username, comment_id)
					VALUES($1, $2)
				`, [user.username, commentId]);
			await queryDb(`
					UPDATE voxieverse_comments
					SET ${action}s = ${action}s + 1
					WHERE id = $1;
				`, [commentId]);
		}

		// Get latest version of post
		const updatedPost = await queryDb(`
				SELECT * FROM voxieverse_comments WHERE id = $1
			`, [commentId]);
		if (!updatedPost?.rows[0]) {
			throw new Error('comment does not exist');
		}

		const comment = updatedPost?.rows[0];
		// Get likes and dislikes for post
		const likedResult = await queryDb(`
				SELECT * FROM voxieverse_comment_likes
				WHERE username = $1 AND comment_id = $2;
			`, [user.username, comment.id]);
		const dislikedResult = await queryDb(`
				SELECT * FROM voxieverse_comment_dislikes
				WHERE username = $1 AND comment_id = $2;
			`, [user.username, comment.id]);
		const refinedComment = {
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
			createdAt: new Date(comment.created_at).toLocaleString(),
		};
		return res.json(refinedComment);
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({error: err.message});
		}
	}
});
