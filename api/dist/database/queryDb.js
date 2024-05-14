
import pgPkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const {dbUser, dbHost, dbPassword} = process.env;
const {Pool} = pgPkg;
const pool = new Pool({
	connectionString: process.env.DATABASE_URL ?? `postgresql://${dbUser}:${dbPassword}@${dbHost}`,
	ssl: {rejectUnauthorized: false},
});
export const queryDb = async (query, values) => {
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
