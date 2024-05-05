import express from 'express';
import bcryptjs from 'bcryptjs';
import {body, validationResult} from 'express-validator';
import {queryDb} from '../../database/queryDb';
import {generateAccessToken, generateRefreshToken} from '../../token/generateToken';

type LoginInfo = {
	username: string;
	password: string;
};

export type CheckUser = {
	username: string;
	email: string;
	password: string;
	created_at: Date;
	last_online: Date;
};

export type RefinedUser = {
	username: string;
	email: string;
	createdAt: string;
	lastOnline: string;
};

export const login = express.Router();

login.post(
	'/',
	body('username')
		.isLength({min: 6})
		.withMessage('Username must be at least 6 characters')
		.isLength({max: 30})
		.withMessage('Username cannot exceed 30 characters')
		.trim()
		.escape(),
	body('password')
		.isLength({min: 6})
		.withMessage('Password must be at least 6 characters')
		.isLength({max: 30})
		.withMessage('Password cannot exceed 30 characters')
		.trim()
		.escape(),
	async (req, res) => {
		if (!req.body) {
			return res.status(400).json({error: 'Request body missing'});
		}

		const {username, password}: LoginInfo = req.body as LoginInfo;
		const validator = validationResult(req).array();

		if (validator.length > 0) {
			const validationError: string = validator[0].msg as string;

			return res.status(200).json({validationError});
		}

		try {
			const checkIfUserExists = await queryDb<string>(`
				SELECT username, email, password, created_at, last_online FROM voxieverse_users
				WHERE username = $1;`
			, [username]);

			const checkedUser: CheckUser = checkIfUserExists?.rows[0] as CheckUser;

			if (!checkedUser) {
				return res.status(200).json({validationError: 'Incorrect user details'});
			}

			const comparePassword = await bcryptjs.compare(password, checkedUser.password);

			if (!comparePassword) {
				return res.status(200).json({validationError: 'Incorrect user details'});
			}

			await queryDb(`
				UPDATE voxieverse_users
				SET last_online = CURRENT_TIMESTAMP
				WHERE username_lower_case = $1;
			`, [username.toLowerCase()]);

			const user: RefinedUser = {
				username: checkedUser.username,
				email: checkedUser.email,
				createdAt: new Date(checkedUser.created_at).toLocaleString(),
				lastOnline: new Date(checkedUser.last_online).toLocaleString(),
			};

			const accessToken = generateAccessToken(user);
			const refreshToken = generateRefreshToken(user);
			const expirationDate = new Date();
			expirationDate.setDate(expirationDate.getDate() + 7);

			res.cookie('accessToken', accessToken, {httpOnly: true, secure: true, expires: expirationDate});
			res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true, expires: expirationDate});

			return res.status(200).json(user);
		} catch (err) {
			if (err instanceof Error) {
				return res.status(500).json({error: err.message});
			}
		}

		return res.json({username, password});
	},
);
