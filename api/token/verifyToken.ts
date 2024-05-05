import {type Request, type Response, type NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {type UserResult} from '../routes/auth/signup';
import {type RefinedUser} from '../routes/auth/login';
import {generateAccessToken} from './generateToken';
import {queryDb} from '../database/queryDb';

dotenv.config();

type Cookies = {
	accessToken: string;
	refreshToken: string;
};

const {jwtSecret} = process.env;

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	const {accessToken, refreshToken}: Cookies = req.cookies as Cookies;

	if (!accessToken || !refreshToken) {
		return res.status(200).json({error: 'No tokens'});
	}

	if (!jwtSecret) {
		return res.status(500).json({error: 'JWT secret is not defined'});
	}

	try {
		const decodedToken: RefinedUser = jwt.verify(accessToken, jwtSecret) as RefinedUser;

		await queryDb(`
			UPDATE voxieverse_users
			SET last_online = CURRENT_TIMESTAMP
			WHERE username_lower_case = $1;
		`, [decodedToken.username.toLowerCase()]);

		const userFromDatabase = await queryDb(`
			SELECT username, email, created_at, last_online
			FROM voxieverse_users
			WHERE username_lower_case = $1;
		`, [decodedToken.username.toLowerCase()]);

		const checkedUser: UserResult = userFromDatabase?.rows[0] as UserResult;

		const user: RefinedUser = {
			username: checkedUser.username,
			email: checkedUser.email,
			createdAt: new Date(checkedUser.created_at).toLocaleString(),
			lastOnline: new Date(checkedUser.last_online).toLocaleString(),
		};

		res.locals.user = user;

		next();
	} catch (err) {
		try {
			const decodedToken: RefinedUser = jwt.verify(refreshToken, jwtSecret) as RefinedUser;

			await queryDb(`
				UPDATE voxieverse_users
				SET last_online = CURRENT_TIMESTAMP
				WHERE username_lower_case = $1;
			`, [decodedToken.username.toLowerCase()]);

			const userFromDatabase = await queryDb(`
				SELECT username, email, created_at, last_online
				FROM voxieverse_users
				WHERE username_lower_case = $1;
			`, [decodedToken.username.toLowerCase()]);

			const checkedUser: UserResult = userFromDatabase?.rows[0] as UserResult;

			const user: RefinedUser = {
				username: checkedUser.username,
				email: checkedUser.email,
				createdAt: new Date(checkedUser.created_at).toLocaleString(),
				lastOnline: new Date(checkedUser.last_online).toLocaleString(),
			};

			res.locals.user = user;

			const newAccessToken = generateAccessToken(user);
			const expirationDate = new Date();
			expirationDate.setDate(expirationDate.getDate() + 7);

			res.cookie('accessToken', newAccessToken, {httpOnly: true, secure: true, expires: expirationDate});

			next();
		} catch (err) {
			if (err instanceof Error) {
				console.error(err);
				return res.status(500).json({error: err.message});
			}
		}
	}
};
