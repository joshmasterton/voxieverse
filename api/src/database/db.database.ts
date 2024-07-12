import pg from 'pg';
import dotenv from 'dotenv';
import { TableConfig } from '../../types/db/database.types';
dotenv.config({ path: './src/env/dev.env' });

const { DB_URL } = process.env;

class TableConfigManager {
  private config: TableConfig;

  constructor() {
    this.config = this.defaultConfig();
  }

  private defaultConfig() {
    return {
      tokensTable: 'voxieverse_tokens',
      usersTable: 'voxieverse_users'
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
    try {
      return this.pool.query(text, params);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
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

  async createTokens(tokensTable = 'voxieverse_tokens') {
    try {
      await this.query(
        `
					CREATE TABLE IF NOT EXISTS ${tokensTable}(
					token_id SERIAL PRIMARY KEY,
					user_id INT NOT NULL,
					refresh_token VARCHAR(500))
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
    tokensTable = 'voxieverse_tokens'
  ) {
    try {
      await this.query(`DROP TABLE IF EXISTS ${usersTable}`, []);
      await this.query(`DROP TABLE IF EXISTS ${tokensTable}`, []);
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
