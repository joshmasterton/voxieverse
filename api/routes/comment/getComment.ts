import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken';
import {queryDb} from '../../database/queryDb';
import {type CommentFromDatabase, type RefinedComment} from './getComments';

export const getComment = express.Router();

getComment.get(
	'/:username/:sort/:page',
	verifyToken,
	body('username')
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
			const {username, sort, page} = req.params;
			const offset = parseInt(page, 10) * 10;
			const validator = validationResult(req).array();

			if (validator.length > 0) {
				const validationError: string = validator[0].msg as string;
				return res.status(200).json({validationError});
			}

			const commentsFromDatabase = await queryDb<string | number>(`
				SELECT * FROM voxieverse_comments
				WHERE username = $1
				ORDER BY ${sort} DESC LIMIT $2 OFFSET $3;
			`, [username, 10, offset]);

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

			return res.json(refinedComments);
		} catch (err) {
			if (err instanceof Error) {
				return res.status(500).json({error: err.message});
			}
		}
	},
);
