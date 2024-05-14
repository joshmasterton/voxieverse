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

export type RefinedCommentWithChildren = RefinedComment & {
	childComments: RefinedComment[];
};

export const getReplies = express.Router();

getReplies.get(
	'/:commentId/:sort/:page',
	verifyToken,
	body('commentId')
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
			const {commentId, sort, page} = req.params;
			const offset = parseInt(page, 10) * 100;
			const validator = validationResult(req).array();

			if (validator.length > 0) {
				const validationError: string = validator[0].msg as string;
				return res.status(200).json({validationError});
			}

			const repliesFromDatabase = await queryDb<number>(`
				SELECT * FROM voxieverse_comments
				WHERE comment_parent_id = $1
				ORDER BY ${sort} DESC LIMIT $2 OFFSET $3;
			`, [parseInt(commentId, 10), 100, offset]);

			const childcomments: CommentFromDatabase[] = repliesFromDatabase?.rows as CommentFromDatabase[];

			const refinedRepliesPomises: Array<Promise<RefinedCommentWithChildren>> = childcomments.map(async childComment => {
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

			const refinedReplies: RefinedCommentWithChildren[] = await Promise.all(refinedRepliesPomises);

			return res.json(refinedReplies);
		} catch (err) {
			if (err instanceof Error) {
				return res.status(500).json({error: err.message});
			}
		}
	},
);
