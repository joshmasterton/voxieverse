import pg from 'pg';
import dotenv from 'dotenv';
import { TableConfig } from '../types/db/database.types';
dotenv.config({ path: './src/env/dev.env' });

const { DB_URL } = process.env;

class TableConfigManager {
  private config: TableConfig;

  constructor() {
    this.config = this.defaultConfig();
  }

  private defaultConfig() {
    return {
      usersTable: 'voxieverse_users',
      postsCommentsTable: 'voxieverse_posts_comments',
      likesDislikesTable: 'voxieverse_likes_dislikes'
    };
  }

  setConfig(newConfig: TableConfig) {
    this.config = newConfig;
  }

  getConfig() {
    return this.config;
  }
}

export const tableConfigManager = new TableConfigManager();

export class Db {
  private pool: pg.Pool;

  constructor() {
    this.pool = new pg.Pool({ connectionString: DB_URL });
  }

  async query<T>(text: string, params: T[]) {
    const client = await this.pool.connect();
    try {
      return await client.query(text, params);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    } finally {
      client.release();
    }
  }

  async createUsers(usersTable = 'voxieverse_users') {
    try {
      await this.query(
        `
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
				`,
        []
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async createPostsComments(postsCommentsTable = 'voxieverse_posts_comments') {
    try {
      await this.query(
        `
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
				`,
        []
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async createLikesDislikes(likesDislikesTable = 'voxieverse_likes_dislikes') {
    try {
      await this.query(
        `
					CREATE TABLE IF NOT EXISTS ${likesDislikesTable}(
						id SERIAL PRIMARY KEY,
						type VARCHAR(10),
						type_id INT NOT NULL,
						useR_id INT NOT NULL,
						reaction VARCHAR(10)
					)
				`,
        []
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async dropTables(
    usersTable = 'voxieverse_users',
    postsCommentsTable = 'voxieverse_posts_comments',
    likesDislikesTable = 'voxieverse_likes_dislikes'
  ) {
    try {
      await this.query(`DROP TABLE IF EXISTS ${usersTable}`, []);
      await this.query(`DROP TABLE IF EXISTS ${postsCommentsTable}`, []);
      await this.query(`DROP TABLE IF EXISTS ${likesDislikesTable}`, []);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async close() {
    return this.pool.end();
  }
}
