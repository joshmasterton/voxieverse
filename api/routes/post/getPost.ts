import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken';
import {queryDb} from '../../database/queryDb';

export type PostFromDatabase = {
	id: number;
	username: string;
	post: string;
	likes: number;
	dislikes: number;
	comments: number;
	created_at: Date;
};

export type RefinedPost = {
	id: number;
	username: string;
	post: string;
	likes: number;
	hasLiked: boolean;
	dislikes: number;
	hasDisliked: boolean;
	comments: number;
	createdAt: string;
};

export const getPost = express.Router();

getPost.get(
	'/:postId',
	verifyToken,
	body('postId')
		.escape()
		.trim(),
	async (req, res) => {
		try {
			const {postId} = req.params;
			const validator = validationResult(req).array();

			if (validator.length > 0) {
				const validationError: string = validator[0].msg as string;
				return res.status(200).json({validationError});
			}

			const postFromDatabase = await queryDb<number>(`
				SELECT * FROM voxieverse_posts
				WHERE id = $1
			`, [parseInt(postId, 10)]);

			const post: PostFromDatabase[] = postFromDatabase?.rows as PostFromDatabase[];

			const refinedPostPomise: Array<Promise<RefinedPost>> = post.map(async post => {
				const likedResult = await queryDb(`
					SELECT * FROM voxieverse_post_likes
					WHERE username = $1 AND post_id = $2;
				`, [res.locals.user.username, post.id]);

				const dislikedResult = await queryDb(`
					SELECT * FROM voxieverse_post_dislikes
					WHERE username = $1 AND post_id = $2;
				`, [res.locals.user.username, post.id]);

				return {
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
			});

			const refinedPost: RefinedPost[] = await Promise.all(refinedPostPomise);

			return res.json(refinedPost[0]);
		} catch (err) {
			if (err instanceof Error) {
				return res.status(500).json({error: err.message});
			}
		}
	},
);
