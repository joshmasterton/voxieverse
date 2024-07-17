import { afterEach, beforeEach } from 'vitest';
import { Db, tableConfigManager } from './src/database/db.database';
import { v4 } from 'uuid';

let db: Db;
let usersTable: string;
let postsTable: string;
let commentsTable: string;

beforeEach(async () => {
  db = new Db();
  usersTable = `voxieverse_users_${v4().replace(/-/g, '_')}_${Date.now()}`;
  postsTable = `voxieverse_posts_${v4().replace(/-/g, '_')}_${Date.now()}`;
  commentsTable = `voxieverse_comments_${v4().replace(/-/g, '_')}_${Date.now()}`;
  await db.dropTables(usersTable, postsTable);
  await db.createUsers(usersTable);
  await db.createPosts(postsTable);
  await db.createComments(commentsTable);

  tableConfigManager.setConfig({
    usersTable,
    postsTable,
    commentsTable
  });
});

afterEach(async () => {
  await db.dropTables(usersTable, postsTable, commentsTable);
  await db.close();
});
