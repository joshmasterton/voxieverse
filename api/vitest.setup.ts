import { afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { Db, tableConfigManager } from './src/database/db.database';
import { v4 } from 'uuid';
import { uploadToS3 } from './src/utilities/uploadS3.utilities';

let db: Db;
let usersTable: string;
let postsCommentsTable: string;
let likesDislikesTable: string;
let friendsTable: string;

const uploadToS3Mocked = vi.mocked(uploadToS3);

vi.mock('./src/utilities/uploadS3.utilities', () => ({
  uploadToS3: vi.fn()
}));

beforeAll(async () => {
  vi.clearAllMocks();
  uploadToS3Mocked.mockResolvedValue('profile.jpg');
});

beforeEach(async () => {
  db = new Db();
  usersTable = `voxieverse_users_${v4().replace(/-/g, '_')}_${Date.now()}`;
  postsCommentsTable = `voxieverse_posts_comments_${v4().replace(/-/g, '_')}_${Date.now()}`;
  likesDislikesTable = `voxieverse_like_dislike_${v4().replace(/-/g, '_')}_${Date.now()}`;
  friendsTable = `voxieverse_like_friends_${v4().replace(/-/g, '_')}_${Date.now()}`;

  await db.dropTables(
    usersTable,
    postsCommentsTable,
    likesDislikesTable,
    friendsTable
  );
  await db.createUsers(usersTable);
  await db.createPostsComments(postsCommentsTable);
  await db.createLikesDislikes(likesDislikesTable);
  await db.createFriends(friendsTable);

  tableConfigManager.setConfig({
    usersTable,
    postsCommentsTable,
    likesDislikesTable,
    friendsTable
  });
});

afterEach(async () => {
  await db.dropTables(
    usersTable,
    postsCommentsTable,
    likesDislikesTable,
    friendsTable
  );
  await db.close();
});
