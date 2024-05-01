import express from 'express';

export const addFriend = express.Router();

addFriend.post('/', (req, res) => {
	console.log('In development');
	return res.json({message: 'In development'});
});
