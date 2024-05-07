import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken';
import {queryDb} from '../../database/queryDb';
import {type UsersFriendship} from './createFriendship';

export type Friendship = {
	user_one: string;
	user_two: string;
	user_initiator: string;
	status: string;
	created_at: Date;
};

type RefinedFriendship = {
	userOne: string;
	userTwo: string;
	userInitiator: string;
	status: string;
	createdAt: string;
};

export const getFriendship = express.Router();

getFriendship.get(
	'/:usernameOne/:usernameTwo',
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
			const {usernameOne, usernameTwo}: UsersFriendship = req.params as UsersFriendship;

			if (validator.length > 0) {
				const validationError: string = validator[0].msg as string;
				return res.status(200).json({validationError});
			}

			const friendshipFromDatabse = await queryDb<string>(`
				SELECT user_one, user_two, user_initiator, status, created_at FROM voxieverse_friendship
				WHERE (user_one = $1 AND user_two = $2)
				OR (user_one = $2 AND user_two = $1)
			`, [usernameOne, usernameTwo]);

			if (friendshipFromDatabse?.rows[0]) {
				const friendship: Friendship = friendshipFromDatabse?.rows[0] as Friendship;

				const refinedFriendship: RefinedFriendship = {
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
	},
);
