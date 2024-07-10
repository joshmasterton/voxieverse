import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: './src/env/dev.env' });

const { DB_URL } = process.env;

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

  async dropUsers(usersTable = 'voxieverse_users') {
    try {
      await this.query(`DROP TABLE IF EXISTS ${usersTable}`, []);
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
