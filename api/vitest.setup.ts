import { afterEach, beforeEach } from 'vitest';
import { Db, tableConfigManager } from './src/database/db.database';
import { v4 } from 'uuid';

let db: Db;
let usersTable: string;
let postsCommentsTable: string;
let likesDislikesTable: string;

beforeEach(async () => {
  db = new Db();
  usersTable = `voxieverse_users_${v4().replace(/-/g, '_')}_${Date.now()}`;
  postsCommentsTable = `voxieverse_posts_comments_${v4().replace(/-/g, '_')}_${Date.now()}`;
  likesDislikesTable = `voxieverse_like_dislike_${v4().replace(/-/g, '_')}_${Date.now()}`;

  await db.dropTables(usersTable, postsCommentsTable, likesDislikesTable);
  await db.createUsers(usersTable);
  await db.createPostsComments(postsCommentsTable);
  await db.createLikesDislikes(likesDislikesTable);

  tableConfigManager.setConfig({
    usersTable,
    postsCommentsTable,
    likesDislikesTable
  });
});

afterEach(async () => {
  await db.dropTables(usersTable, postsCommentsTable, likesDislikesTable);
  await db.close();
});
