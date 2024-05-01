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

export const getPosts = express.Router();

getPosts.get(
	'/:sort',
	verifyToken,
	body('sort')
		.escape()
		.trim(),
	async (req, res) => {
		try {
			const {sort} = req.params;
			const validator = validationResult(req).array();

			if (validator.length > 0) {
				const validationError: string = validator[0].msg as string;
				return res.status(200).json({validationError});
			}

			const postsFromDatabase = await queryDb<number>(`
				SELECT * FROM voxieverse_posts ORDER BY ${sort} DESC LIMIT $1;
			`, [10]);

			const posts: PostFromDatabase[] = postsFromDatabase?.rows as PostFromDatabase[];

			const refinedPostsPomises: Array<Promise<RefinedPost>> = posts.map(async post => {
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

			const refinedPosts: RefinedPost[] = await Promise.all(refinedPostsPomises);

			return res.json(refinedPosts);
		} catch (err) {
			if (err instanceof Error) {
				return res.status(500).json({error: err.message});
			}
		}
	},
);
