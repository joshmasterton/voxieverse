import express from 'express';
import {body, validationResult} from 'express-validator';
import {verifyToken} from '../../token/verifyToken';
import {queryDb} from '../../database/queryDb';

type Contact = {
	username: string;
	email: string;
	created_at: Date;
	last_online: Date;
};

type RefinedContact = {
	username: string;
	email: string;
	createdAt: string;
	lastOnline: string;
};

export const getContact = express.Router();

getContact.get(
	'/:contactUsername',
	verifyToken,
	body('contactUsername')
		.escape()
		.trim(),
	async (req, res) => {
		const validator = validationResult(req).array();
		const {contactUsername} = req.params;

		if (validator.length > 0) {
			const validationError: string = validator[0].msg as string;
			return res.status(200).json({validationError});
		}

		try {
			const contact = await queryDb<string>(`
				SELECT username, email, created_at, last_online FROM voxieverse_users
				WHERE username = $1;
			`, [contactUsername]);

			const contactFromDatabase: Contact = contact?.rows[0] as Contact;

			const refinedUsers: RefinedContact = {
				username: contactFromDatabase.username,
				email: contactFromDatabase.email,
				createdAt: new Date(contactFromDatabase.created_at).toLocaleString(),
				lastOnline: new Date(contactFromDatabase.last_online).toLocaleString(),
			};

			return res.json(refinedUsers);
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message);
				return res.json({error: err.message});
			}
		}
	});
