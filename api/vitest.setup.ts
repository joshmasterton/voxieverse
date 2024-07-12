import { afterEach, beforeEach } from 'vitest';
import { Db, tableConfigManager } from './src/database/db.database';
import { v4 } from 'uuid';

let db: Db;
let usersTable: string;
let tokensTable: string;

beforeEach(async () => {
  db = new Db();
  usersTable = `voxieverse_users_${v4().replace(/-/g, '_')}_${Date.now()}`;
  tokensTable = `voxieverse_tokens_${v4().replace(/-/g, '_')}_${Date.now()}`;
  await db.dropTables(usersTable, tokensTable);
  await db.createUsers(usersTable);
  await db.createTokens(tokensTable);

  tableConfigManager.setConfig({
    tokensTable,
    usersTable
  });
});

afterEach(async () => {
  await db.dropTables(usersTable, tokensTable);
  await db.close();
});
