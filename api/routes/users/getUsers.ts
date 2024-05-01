import express from 'express';
import {verifyToken} from '../../token/verifyToken';
import {queryDb} from '../../database/queryDb';

type User = {
	username: string;
	email: string;
	created_at: Date;
	last_online: Date;
};

type RefinedUser = {
	username: string;
	email: string;
	createdAt: string;
	lastOnline: string;
};

export const getUsers = express.Router();

getUsers.get('/', verifyToken, async (req, res) => {
	try {
		const users = await queryDb(`
			SELECT username, email, created_at, last_online FROM voxieverse_users;
		`, undefined);

		const usersFromDatabase: User[] = users?.rows as User[];

		const refinedUsers: RefinedUser[] = usersFromDatabase.map(user => ({
			username: user.username,
			email: user.email,
			createdAt: new Date(user.created_at).toLocaleString(),
			lastOnline: new Date(user.last_online).toLocaleString(),
		}));

		return res.json(refinedUsers);
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
			return res.json({error: err.message});
		}
	}
});
