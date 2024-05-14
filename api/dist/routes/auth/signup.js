import express from 'express';
import bcryptjs from 'bcryptjs';
import {body, validationResult} from 'express-validator';
import {queryDb} from '../../database/queryDb.js';
import {generateAccessToken, generateRefreshToken} from '../../token/generateToken.js';
export const signup = express.Router();
signup.post('/', body('username')
	.isLength({min: 6})
	.withMessage('Username must be at least 6 characters')
	.isLength({max: 30})
	.withMessage('Username cannot exceed 30 characters')
	.trim()
	.escape(), body('email')
	.isEmail()
	.withMessage('Must be of valid email type')
	.trim()
	.escape(), body('password')
	.isLength({min: 6})
	.withMessage('Password must be at least 6 characters')
	.isLength({max: 30})
	.withMessage('Password cannot exceed 30 characters')
	.trim()
	.escape(), async (req, res) => {
	if (!req.body) {
		return res.status(400).json({error: 'Request body missing'});
	}

	const {username, email, password, confirmPassword} = req.body;
	const validator = validationResult(req).array();
	if (validator.length > 0) {
		const validationError = validator[0].msg;
		return res.status(200).json({validationError});
	}

	if (password !== confirmPassword) {
		return res.status(200).json({validationError: 'Passwords must match'});
	}

	try {
		const checkIfUserExists = await queryDb(`
				SELECT username, email, created_at FROM voxieverse_users
				WHERE username_lower_case = $1;`, [username.toLowerCase()]);
		const checkedUser = checkIfUserExists?.rows[0];
		if (checkedUser) {
			return res.status(200).json({validationError: 'User already exists'});
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const signupQuery = await queryDb(`
				INSERT INTO voxieverse_users(
					username,
					username_lower_case,
					email,
					password
				)VALUES(
					$1, $2, $3, $4
				) RETURNING username, email, created_at, last_online;`, [username, username.toLowerCase(), email, hashedPassword]);
		const userResult = signupQuery?.rows[0];
		const user = {
			username: userResult.username,
			email: userResult.email,
			createdAt: new Date(userResult.created_at).toLocaleString(),
			lastOnline: new Date(userResult.last_online).toLocaleString(),
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
});
