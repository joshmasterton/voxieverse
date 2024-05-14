import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {generateAccessToken} from './generateToken.js';
import {queryDb} from '../database/queryDb.js';
dotenv.config();
const {jwtSecret} = process.env;
export const verifyToken = async (req, res, next) => {
	const {accessToken, refreshToken} = req.cookies;
	if (!accessToken || !refreshToken) {
		return res.status(200).json({error: 'No tokens'});
	}

	if (!jwtSecret) {
		return res.status(500).json({error: 'JWT secret is not defined'});
	}

	try {
		const decodedToken = jwt.verify(accessToken, jwtSecret);
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
		const checkedUser = userFromDatabase?.rows[0];
		const user = {
			username: checkedUser.username,
			email: checkedUser.email,
			createdAt: new Date(checkedUser.created_at).toLocaleString(),
			lastOnline: new Date(checkedUser.last_online).toLocaleString(),
		};
		res.locals.user = user;
		next();
	} catch {
		try {
			const decodedToken = jwt.verify(refreshToken, jwtSecret);
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
			const checkedUser = userFromDatabase?.rows[0];
			const user = {
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
