import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { DB_URL } = process.env;
class TableConfigManager {
    config;
    constructor() {
        this.config = this.defaultConfig();
    }
    defaultConfig() {
        return {
            usersTable: 'voxieverse_users',
            postsCommentsTable: 'voxieverse_posts_comments',
            likesDislikesTable: 'voxieverse_likes_dislikes'
        };
    }
    setConfig(newConfig) {
        this.config = newConfig;
    }
    getConfig() {
        return this.config;
    }
}
export const tableConfigManager = new TableConfigManager();
export class Db {
    pool;
    constructor() {
        this.pool = new pg.Pool({ connectionString: DB_URL });
    }
    async query(text, params) {
        const client = await this.pool.connect();
        try {
            return await client.query(text, params);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
        finally {
            client.release();
        }
    }
    async createUsers(usersTable = 'voxieverse_users') {
        try {
            await this.query(`
					CREATE TABLE IF NOT EXISTS ${usersTable}(
					user_id SERIAL PRIMARY KEY,
					username VARCHAR(50),
					username_lower_case VARCHAR(50),
					email VARCHAR(50),
					password VARCHAR(100),
					profile_picture VARCHAR(255),
					likes INT DEFAULT 0,
					dislikes INT DEFAULT 0,
					posts INT DEFAULT 0,
					comments INT DEFAULT 0,
					friends INT DEFAULT 0,
					created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
					last_online TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)
				`, []);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    async createPostsComments(postsCommentsTable = 'voxieverse_posts_comments') {
        try {
            await this.query(`
					CREATE TABLE IF NOT EXISTS ${postsCommentsTable}(
						id SERIAL PRIMARY KEY,
						post_parent_id INT DEFAULT NULL,
						comment_parent_id INT DEFAULT NULL,
						user_id INT NOT NULL,
						type VARCHAR(10),
						text VARCHAR(500),
						picture VARCHAR(255),
						likes INT DEFAULT 0,
						dislikes INT DEFAULT 0,
						comments INT DEFAULT 0,
						created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
					)
				`, []);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    async createLikesDislikes(likesDislikesTable = 'voxieverse_likes_dislikes') {
        try {
            await this.query(`
					CREATE TABLE IF NOT EXISTS ${likesDislikesTable}(
						id SERIAL PRIMARY KEY,
						type VARCHAR(10),
						type_id INT NOT NULL,
						useR_id INT NOT NULL,
						reaction VARCHAR(10)
					)
				`, []);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    async dropTables(usersTable = 'voxieverse_users', postsCommentsTable = 'voxieverse_posts_comments', likesDislikesTable = 'voxieverse_likes_dislikes') {
        try {
            await this.query(`DROP TABLE IF EXISTS ${usersTable}`, []);
            await this.query(`DROP TABLE IF EXISTS ${postsCommentsTable}`, []);
            await this.query(`DROP TABLE IF EXISTS ${likesDislikesTable}`, []);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    async close() {
        return this.pool.end();
    }
}
