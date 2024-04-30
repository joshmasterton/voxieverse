import express from 'express';
import {verifyToken} from '../../token/verifyToken';

export const logout = express.Router();

logout.get('/', verifyToken, (req, res) => {
	res.clearCookie('accessToken', {httpOnly: true, secure: true});
	res.clearCookie('refreshToken', {httpOnly: true, secure: true});
	return res.json({error: 'Logout successful'});
});
