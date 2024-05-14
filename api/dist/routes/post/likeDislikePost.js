import express from 'express';
import {body, validationResult} from 'express-validator';
import {queryDb} from '../../database/queryDb.js';
import {verifyToken} from '../../token/verifyToken.js';
export const likeDislikePost = express.Router();
likeDislikePost.put('/', verifyToken, body('postId')
	.escape()
	.trim(), body('action')
	.escape()
	.trim(), async (req, res) => {
	try {
		const validator = validationResult(req).array();
		const {postId, action} = req.body;
		const {user} = res.locals;
		if (validator.length > 0) {
			const validationError = validator[0].msg;
			return res.status(200).json({validationError});
		}

		// Has user already liked or disliked post
		const existingInteraction = await queryDb(`
				SELECT * FROM voxieverse_post_${action}s
				WHERE username = $1 AND post_id = $2
			`, [user.username, postId]);
		// If so delete relation
		if (existingInteraction?.rows[0]) {
			await queryDb(`
				DELETE FROM voxieverse_post_${action}s
				WHERE username = $1 AND post_id = $2
			`, [user.username, postId]);
			await queryDb(`
					UPDATE voxieverse_posts
					SET ${action}s = ${action}s - 1
					WHERE id = $1;
				`, [postId]);
		} else {
			// Check if user disliked a liked post and vice versa
			const existingLikeOrDislike = await queryDb(`
					SELECT * FROM voxieverse_post_${action === 'like' ? 'dislike' : 'like'}s
					WHERE username = $1 AND post_id = $2
				`, [user.username, postId]);
			// If so delete relation
			if (existingLikeOrDislike?.rows[0]) {
				await queryDb(`
						DELETE FROM voxieverse_post_${action === 'like' ? 'dislike' : 'like'}s
						WHERE username = $1 AND post_id = $2
					`, [user.username, postId]);
				await queryDb(`
						UPDATE voxieverse_posts
						SET ${action === 'like' ? 'dislike' : 'like'}s = ${action === 'like' ? 'dislike' : 'like'}s - 1
						WHERE id = $1;
					`, [postId]);
			}

			// Insert new like or dislike to post
			await queryDb(`
					INSERT INTO voxieverse_post_${action}s(username, post_id)
					VALUES($1, $2)
				`, [user.username, postId]);
			await queryDb(`
					UPDATE voxieverse_posts
					SET ${action}s = ${action}s + 1
					WHERE id = $1;
				`, [postId]);
		}

		// Get latest version of post
		const updatedPost = await queryDb(`
				SELECT * FROM voxieverse_posts WHERE id = $1
			`, [postId]);
		if (!updatedPost?.rows[0]) {
			throw new Error('Post does not exist');
		}

		const post = updatedPost?.rows[0];
		// Get likes and dislikes for post
		const likedResult = await queryDb(`
				SELECT * FROM voxieverse_post_likes
				WHERE username = $1 AND post_id = $2;
			`, [user.username, post.id]);
		const dislikedResult = await queryDb(`
				SELECT * FROM voxieverse_post_dislikes
				WHERE username = $1 AND post_id = $2;
			`, [user.username, post.id]);
		const refinedPost = {
			id: post.id,
			username: post.username,
			post: post.post,
			likes: post.likes,
			hasLiked: Boolean(likedResult?.rows[0]),
			dislikes: post.dislikes,
			hasDisliked: Boolean(dislikedResult?.rows[0]),
			comments: post.comments,
			createdAt: new Date(post.created_at).toLocaleString(),
		};
		return res.json(refinedPost);
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({error: err.message});
		}
	}
});
