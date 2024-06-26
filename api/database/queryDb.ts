/* eslint-disable @typescript-eslint/naming-convention */
import pgPkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {dbUser, dbHost, dbPassword} = process.env;
const {Pool} = pgPkg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL ?? `postgresql://${dbUser}:${dbPassword}@${dbHost}`,
});

export const queryDb = async <T>(query: string, values: T[] | undefined) => {
	try {
		const result = await pool.query(query, values);
		return result;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err);
			throw err;
		}
	}
};
