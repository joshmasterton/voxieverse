import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken.js';
import {queryDb} from '../../database/queryDb.js';
export const deleteFriendship = express.Router();
deleteFriendship.delete('/', verifyToken, body('usernameOne')
	.escape()
	.trim(), body('usernameTwo')
	.escape()
	.trim(), async (req, res) => {
	try {
		const validator = validationResult(req).array();
		const {usernameOne, usernameTwo} = req.body;
		if (validator.length > 0) {
			const validationError = validator[0].msg;
			return res.status(200).json({validationError});
		}

		const doesFriendshipExist = await queryDb(`
				SELECT * FROM voxieverse_friendship
				WHERE (user_one = $1 AND user_two = $2)
				OR (user_one = $2 AND user_two = $1)
			`, [usernameOne, usernameTwo]);
		if (doesFriendshipExist?.rows[0]) {
			await queryDb(`
					DELETE FROM voxieverse_friendship
					WHERE (user_one = $1 AND user_two = $2)
					OR (user_one = $2 AND user_two = $1)
				`, [usernameOne, usernameTwo]);
			return res.status(201).json({message: 'Friendship ended'});
		}

		return res.json({message: 'Friendship does not exist'});
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({error: err.message});
		}
	}
});
