import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {type RefinedUser} from '../routes/login';

dotenv.config();

const {jwtSecret} = process.env;

export const generateAccessToken = (user: RefinedUser) => {
	try {
		if (!jwtSecret) {
			throw new Error('JWT secret is not defined');
		}

		if (!user) {
			throw new Error('Invalid user object');
		}

		const accessToken = jwt.sign(user, jwtSecret, {expiresIn: '10s'});
		return accessToken;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err);
			throw err;
		}
	}
};

export const generateRefreshToken = (user: RefinedUser) => {
	try {
		if (!jwtSecret) {
			throw new Error('JWT secret is not defined');
		}

		if (!user) {
			throw new Error('Invalid user object');
		}

		const refreshToken = jwt.sign(user, jwtSecret, {expiresIn: '7d'});
		return refreshToken;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
