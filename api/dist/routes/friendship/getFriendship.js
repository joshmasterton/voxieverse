import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken.js';
import {queryDb} from '../../database/queryDb.js';
export const getFriendship = express.Router();
getFriendship.get('/:usernameOne/:usernameTwo', verifyToken, body('usernameOne')
	.escape()
	.trim(), body('usernameTwo')
	.escape()
	.trim(), async (req, res) => {
	try {
		const validator = validationResult(req).array();
		const {usernameOne, usernameTwo} = req.params;
		if (validator.length > 0) {
			const validationError = validator[0].msg;
			return res.status(200).json({validationError});
		}

		const friendshipFromDatabse = await queryDb(`
				SELECT user_one, user_two, user_initiator, status, created_at FROM voxieverse_friendship
				WHERE (user_one = $1 AND user_two = $2)
				OR (user_one = $2 AND user_two = $1)
			`, [usernameOne, usernameTwo]);
		if (friendshipFromDatabse?.rows[0]) {
			const friendship = friendshipFromDatabse?.rows[0];
			const refinedFriendship = {
				userOne: friendship.user_one,
				userTwo: friendship.user_two,
				userInitiator: friendship.user_initiator,
				status: friendship.status,
				createdAt: new Date(friendship.created_at).toLocaleString(),
			};
			return res.status(201).json(refinedFriendship);
		}

		return res.json({error: 'No friendship'});
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({error: err.message});
		}
	}
});
