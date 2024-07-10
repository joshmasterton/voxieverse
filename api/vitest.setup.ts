import { afterEach, beforeEach } from 'vitest';
import { Db } from './src/database/db.database';
import { v4 } from 'uuid';

let db: Db;
let usersTable: string;

beforeEach(async () => {
  db = new Db();
  usersTable = `voxieverse_users_${v4().replace(/-/g, '_')}_${Date.now()}`;
  await db.createUsers(usersTable);
});

afterEach(async () => {
  await db.dropUsers(usersTable);
  await db.close();
});

export const getTestUsersTable = () => usersTable;
