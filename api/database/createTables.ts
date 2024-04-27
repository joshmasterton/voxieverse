import {queryDb} from './queryDb';

export const dropUsersTable = async () => {
	await queryDb('DROP TABLE IF EXISTS voxieverse_users', undefined);
};

export const createUsersTable = async () => {
	await queryDb(`
		CREATE TABLE IF NOT EXISTS voxieverse_users(
			id SERIAL PRIMARY KEY,
			username VARCHAR(30),
			username_lower_case VARCHAR(30),
			email VARCHAR(60),
			password VARCHAR(200),
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);`
	, undefined);
};
