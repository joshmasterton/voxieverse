import express from 'express';
import {param, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken';
import {queryDb} from '../../database/queryDb';
import {type Friendship} from '../friendship/getFriendship';
import {type RefinedUserFriendship} from './getUsers';

type User = {
	username: string;
	email: string;
	created_at: Date;
	last_online: Date;
};

export const getFriends = express.Router();

getFriends.get(
	'/:filter?',
	verifyToken,
	param('filter')
		.trim()
		.escape(),
	async (req, res) => {
		const validator = validationResult(req).array();

		if (validator.length > 0) {
			const validationError: string = validator[0].msg as string;
			return res.status(200).json({validationError});
		}

		try {
			const {filter = ''} = req.params;
			const users = await queryDb<string>(`
			SELECT username, email, created_at, last_online FROM voxieverse_users
			WHERE username != $1
			AND username_lower_case LIKE '%' || $2 || '%';
		`, [res.locals.user.username, filter.toLowerCase()]);

			const usersFromDatabase: User[] = users?.rows as User[];

			const refinedUsers: RefinedUserFriendship[] = await Promise.all(usersFromDatabase.map(async user => {
				const friendshipFromDatabse = await queryDb<string>(`
				SELECT user_one, user_two, user_initiator, status, created_at FROM voxieverse_friendship
				WHERE (user_one = $1 AND user_two = $2)
				OR (user_one = $2 AND user_two = $1)
			`, [res.locals.user.username, user.username]);

				const friendship: Friendship = friendshipFromDatabse?.rows[0] as Friendship;

				if (friendship) {
					return {
						username: user.username,
						email: user.email,
						createdAt: new Date(user.created_at).toLocaleString(),
						lastOnline: new Date(user.last_online).toLocaleString(),
						friendshipStatus: friendship ? friendship.status : undefined,
					};
				}

				return undefined;
			}));

			return res.json(refinedUsers.filter(friend => friend));
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message);
				return res.json({error: err.message});
			}
		}
	},
);
