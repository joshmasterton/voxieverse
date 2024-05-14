import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken.js';
import {queryDb} from '../../database/queryDb.js';
export const createFriendship = express.Router();
createFriendship.post('/', verifyToken, body('usernameOne')
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

		// Check if friendship exists
		const friendshipFromDatabase = await queryDb(`
				SELECT * FROM voxieverse_friendship
				WHERE (user_one = $1 AND user_two = $2)
				OR (user_one = $2 AND user_two = $1)
			`, [usernameOne, usernameTwo]);
		// If frienship request confirm it
		if (friendshipFromDatabase?.rows[0]) {
			const friendship = friendshipFromDatabase?.rows[0];
			if (friendship.status === 'pending' && friendship.user_initiator !== usernameOne) {
				await queryDb(`
						UPDATE voxieverse_friendship
						SET status = 'accepted'
            WHERE (user_one = $1 AND user_two = $2)
            OR (user_one = $2 AND user_two = $1)
					`, [usernameOne, usernameTwo]);
				return res.status(201).json({message: 'User has accepted friendship request'});
			}

			return res.status(201).json({message: 'Friendship already exists'});
		}

		// Create new frienship request
		await queryDb(`
				INSERT INTO voxieverse_friendship(
					user_one,
					user_two,
					user_initiator
				)VALUES($1, $2, $3);
			`, [usernameOne, usernameTwo, usernameOne]);
		return res.json({message: 'Friendship successful'});
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({error: err.message});
		}
	}
});
