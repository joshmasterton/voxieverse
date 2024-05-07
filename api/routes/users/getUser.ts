import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken';
import {queryDb} from '../../database/queryDb';
import {type CheckUser, type RefinedUser} from '../auth/login';

export const getUser = express.Router();

getUser.get(
	'/:username',
	verifyToken,
	body('username')
		.escape()
		.trim(),
	async (req, res) => {
		const validator = validationResult(req).array();
		const {username} = req.params;

		if (validator.length > 0) {
			const validationError: string = validator[0].msg as string;
			return res.status(200).json({validationError});
		}

		try {
			const contact = await queryDb<string>(`
				SELECT username, email, created_at, last_online FROM voxieverse_users
				WHERE username = $1;
			`, [username]);

			const userFromDatabase: CheckUser = contact?.rows[0] as CheckUser;

			const refinedUser: RefinedUser = {
				username: userFromDatabase.username,
				email: userFromDatabase.email,
				createdAt: new Date(userFromDatabase.created_at).toLocaleString(),
				lastOnline: new Date(userFromDatabase.last_online).toLocaleString(),
			};

			return res.json(refinedUser);
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message);
				return res.json({error: err.message});
			}
		}
	});
