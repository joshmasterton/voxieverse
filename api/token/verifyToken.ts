import {type Request, type Response, type NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {type RefinedUser} from '../routes/login';
import {generateAccessToken} from './generateToken';

dotenv.config();

type Cookies = {
	accessToken: string;
	refreshToken: string;
};

const {jwtSecret} = process.env;

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const {accessToken, refreshToken}: Cookies = req.cookies as Cookies;

	if (!accessToken || !refreshToken) {
		return res.status(500).json({error: 'No tokens'});
	}

	if (!jwtSecret) {
		return res.status(500).json({error: 'JWT secret is not defined'});
	}

	try {
		const decodedToken: RefinedUser = jwt.verify(accessToken, jwtSecret) as RefinedUser;

		res.locals.user = {
			username: decodedToken.username,
			email: decodedToken.email,
			createdAt: decodedToken.createdAt,
		};
		next();
	} catch (err) {
		try {
			const decodedToken: RefinedUser = jwt.verify(refreshToken, jwtSecret) as RefinedUser;

			const user = {
				username: decodedToken.username,
				email: decodedToken.email,
				createdAt: decodedToken.createdAt,
			};

			res.locals.user = user;

			const newAccessToken = generateAccessToken(user);
			res.cookie('accessToken', newAccessToken, {httpOnly: true, secure: true});

			next();
		} catch (err) {
			if (err instanceof Error) {
				console.error(err);
				return res.status(500).json({error: err.message});
			}
		}
	}
};
