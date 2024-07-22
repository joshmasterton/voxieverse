import { afterEach, beforeEach } from 'vitest';
import { Db, tableConfigManager } from './src/database/db.database';
import { v4 } from 'uuid';

let db: Db;
let usersTable: string;
let postsCommentsTable: string;
let likeDislikeTable: string;

beforeEach(async () => {
  db = new Db();
  usersTable = `voxieverse_users_${v4().replace(/-/g, '_')}_${Date.now()}`;
  postsCommentsTable = `voxieverse_posts_comments_${v4().replace(/-/g, '_')}_${Date.now()}`;
  likeDislikeTable = `voxieverse_like_dislike_${v4().replace(/-/g, '_')}_${Date.now()}`;

  await db.dropTables(usersTable, postsCommentsTable, likeDislikeTable);
  await db.createUsers(usersTable);
  await db.createPostsComments(postsCommentsTable);
  await db.createLikeDislike(likeDislikeTable);

  tableConfigManager.setConfig({
    usersTable,
    postsCommentsTable,
    likeDislikeTable
  });
});

afterEach(async () => {
  await db.dropTables(usersTable, postsCommentsTable, likeDislikeTable);
  await db.close();
});
