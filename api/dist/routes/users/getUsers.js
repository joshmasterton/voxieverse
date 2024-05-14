import express from 'express';
import {param, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken.js';
import {queryDb} from '../../database/queryDb.js';
export const getUsers = express.Router();
getUsers.get('/:page?/:filter?/', verifyToken, param('page')
	.escape()
	.isInt({min: 0})
	.toInt()
	.trim(), param('filter')
	.optional()
	.trim()
	.escape(), async (req, res) => {
	const validator = validationResult(req).array();
	if (validator.length > 0) {
		const validationError = validator[0].msg;
		return res.status(200).json({validationError});
	}

	try {
		const {filter = '', page} = req.params;
		const offset = parseInt(page, 10) * 10;
		const users = await queryDb(`
				SELECT username, email, created_at, last_online FROM voxieverse_users
				WHERE username != $1
				AND username_lower_case LIKE '%' || $2 || '%'
				LIMIT 10 OFFSET $3;
			`, [res.locals.user.username, filter.toLowerCase(), offset]);
		const usersFromDatabase = users?.rows;
		const refinedUsers = await Promise.all(usersFromDatabase.map(async user => {
			const friendshipFromDatabse = await queryDb(`
					SELECT user_one, user_two, user_initiator, status, created_at FROM voxieverse_friendship
					WHERE (user_one = $1 AND user_two = $2)
					OR (user_one = $2 AND user_two = $1)
				`, [res.locals.user.username, user.username]);
			const friendship = friendshipFromDatabse?.rows[0];
			return {
				username: user.username,
				email: user.email,
				createdAt: new Date(user.created_at).toLocaleString(),
				lastOnline: new Date(user.last_online).toLocaleString(),
				friendshipStatus: friendship ? friendship.status : undefined,
			};
		}));
		return res.status(201).json(refinedUsers);
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
			return res.json({error: err.message});
		}
	}
});
