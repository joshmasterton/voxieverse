import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken';
import {queryDb} from '../../database/queryDb';

export type CommentFromDatabase = {
	id: number;
	post_id: number;
	// eslint-disable-next-line @typescript-eslint/ban-types
	comment_parent_id: number | null;
	username: string;
	comment: string;
	likes: number;
	dislikes: number;
	comments: number;
	created_at: Date;
};

export type RefinedComment = {
	id: number;
	postId: number;
	// eslint-disable-next-line @typescript-eslint/ban-types
	commentParentId: number | null;
	username: string;
	comment: string;
	likes: number;
	hasLiked: boolean;
	dislikes: number;
	hasDisliked: boolean;
	comments: number;
	createdAt: string;
};

export const getComments = express.Router();

getComments.get(
	'/:postId/:sort/:page',
	verifyToken,
	body('postId')
		.escape()
		.trim(),
	body('sort')
		.escape()
		.trim(),
	body('page')
		.escape()
		.trim(),
	async (req, res) => {
		try {
			const {postId, sort, page} = req.params;
			const offset = parseInt(page, 10) * 100;
			const validator = validationResult(req).array();

			if (validator.length > 0) {
				const validationError: string = validator[0].msg as string;
				return res.status(200).json({validationError});
			}

			const commentsFromDatabase = await queryDb<number>(`
				SELECT * FROM voxieverse_comments
				WHERE post_id = $1
				ORDER BY ${sort} DESC LIMIT $2 OFFSET $3;
			`, [parseInt(postId, 10), 100, offset]);

			const comments: CommentFromDatabase[] = commentsFromDatabase?.rows as CommentFromDatabase[];

			const refinedCommentsPomises: Array<Promise<RefinedComment>> = comments.map(async comment => {
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

			const refinedComments: RefinedComment[] = await Promise.all(refinedCommentsPomises);

			// eslint-disable-next-line @typescript-eslint/ban-types
			const nestComments = (comments: RefinedComment[], parentId: number | null = null): RefinedComment[] => comments
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
	},
);
