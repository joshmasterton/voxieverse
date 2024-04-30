import express from 'express';
import {verifyToken} from '../../token/verifyToken';

export const validateUser = express.Router();

validateUser.get('/', verifyToken, (req, res) => {
	if (res.locals.user) {
		const {user} = res.locals;
		return res.status(200).json(user);
	}

	return res.status(200).json({err: 'Cannot get user'});
});
