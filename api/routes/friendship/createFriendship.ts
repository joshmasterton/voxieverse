import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken';
import {queryDb} from '../../database/queryDb';
import {type Friendship} from './getFriendship';

export type UsersFriendship = {
	usernameOne: string;
	usernameTwo: string;
};

export const createFriendship = express.Router();

createFriendship.post(
	'/',
	verifyToken,
	body('usernameOne')
		.escape()
		.trim(),
	body('usernameTwo')
		.escape()
		.trim(),
	async (req, res) => {
		try {
			const validator = validationResult(req).array();
			const {usernameOne, usernameTwo}: UsersFriendship = req.body as UsersFriendship;

			if (validator.length > 0) {
				const validationError: string = validator[0].msg as string;
				return res.status(200).json({validationError});
			}

			// Check if friendship exists
			const friendshipFromDatabase = await queryDb<string>(`
				SELECT * FROM voxieverse_friendship
				WHERE (user_one = $1 AND user_two = $2)
				OR (user_one = $2 AND user_two = $1)
			`, [usernameOne, usernameTwo]);

			// If frienship request confirm it
			if (friendshipFromDatabase?.rows[0]) {
				const friendship: Friendship = friendshipFromDatabase?.rows[0] as Friendship;
				if (friendship.status === 'pending' && friendship.user_initiator !== usernameOne) {
					await queryDb<string>(`
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
			await queryDb<string | boolean>(`
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
	},
);
