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
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
			last_online TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);
	`, undefined);
};

export const dropPostsTable = async () => {
	await queryDb('DROP TABLE IF EXISTS voxieverse_posts', undefined);
};

export const createPostsTable = async () => {
	await queryDb(`
		CREATE TABLE IF NOT EXISTS voxieverse_posts(
			id SERIAL PRIMARY KEY,
			username VARCHAR(30),
			post VARCHAR(500),
			likes INT DEFAULT 0,
			dislikes INT DEFAULT 0,
			comments INT DEFAULT 0,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);
		`, undefined);
};

export const dropPostLikesTable = async () => {
	await queryDb('DROP TABLE IF EXISTS voxieverse_post_likes', undefined);
};

export const createPostLikesTable = async () => {
	await queryDb(`
		CREATE TABLE IF NOT EXISTS voxieverse_post_likes(
			id SERIAL PRIMARY KEY,
			username VARCHAR(30),
			post_id INT,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);
	`, undefined);
};

export const dropPostDislikesTable = async () => {
	await queryDb('DROP TABLE IF EXISTS voxieverse_post_dislikes;', undefined);
};

export const createPostDislikesTable = async () => {
	await queryDb(`
		CREATE TABLE IF NOT EXISTS voxieverse_post_dislikes(
			id SERIAL PRIMARY KEY,
			username VARCHAR(30),
			post_id INT,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);
	`, undefined);
};

export const dropFriendshipTable = async () => {
	await queryDb('DROP TABLE IF EXISTS voxieverse_friendship;', undefined);
};

export const createFriendshipTable = async () => {
	await queryDb(`
		CREATE TABLE IF NOT EXISTS voxieverse_friendship(
			friendship_id SERIAL PRIMARY KEY,
			user_one VARCHAR(30),
			user_two VARCHAR(30),
			user_initiator VARCHAR(30),
			status VARCHAR(20) DEFAULT 'pending',
			created_At TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);
	`, undefined);
};
