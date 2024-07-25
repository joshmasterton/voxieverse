import { Db, tableConfigManager } from '../database/db.database.js';
const db = new Db();
export class LikeDislike {
  user_id;
  type_id;
  type;
  reaction;
  constructor(user_id, type_id, type, reaction) {
    this.user_id = user_id;
    this.type_id = type_id;
    this.type = type;
    this.reaction = reaction;
  }
  async create() {
    const { likesDislikesTable, postsCommentsTable, usersTable } =
      tableConfigManager.getConfig();
    try {
      const existingLikeDislike = await db.query(
        `
					SELECT * FROM ${likesDislikesTable}
					WHERE type = $1 AND type_id = $2 AND user_id = $3
				`,
        [this.type, this.type_id, this.user_id]
      );
      const postComment = await db.query(
        `
					SELECT user_id from ${postsCommentsTable}
					WHERE id = $1
				`,
        [this.type_id]
      );
      if (!postComment?.rows[0]) {
        throw new Error(`No ${this.type} found`);
      }
      if (existingLikeDislike?.rows[0]) {
        if (existingLikeDislike?.rows[0].reaction === this.reaction) {
          await db.query(
            `
							DELETE FROM ${likesDislikesTable}
							WHERE type_id = $1 AND user_id = $2
						`,
            [this.type_id, this.user_id]
          );
          await db.query(
            `
							UPDATE ${postsCommentsTable}
							SET ${this.reaction}s = ${this.reaction}s - 1
							WHERE id = $1
						`,
            [this.type_id]
          );
          await db.query(
            `
							UPDATE ${usersTable}
							SET ${this.reaction}s = ${this.reaction}s - 1
							WHERE user_id = $1
						`,
            [postComment.rows[0].user_id]
          );
        } else {
          const oppositeReaction =
            this.reaction === 'like' ? 'dislike' : 'like';
          await db.query(
            `
							UPDATE ${likesDislikesTable}
							SET reaction = $1
							WHERE type_id = $2 AND user_id = $3
						`,
            [this.reaction, this.type_id, this.user_id]
          );
          await db.query(
            `
							UPDATE ${postsCommentsTable}
							SET ${oppositeReaction}s = ${oppositeReaction}s - 1
							WHERE id = $1
						`,
            [this.type_id]
          );
          await db.query(
            `
							UPDATE ${usersTable}
							SET ${oppositeReaction}s = ${oppositeReaction}s - 1
							WHERE user_id = $1
						`,
            [postComment.rows[0].user_id]
          );
          await db.query(
            `
							UPDATE ${postsCommentsTable}
							SET ${this.reaction}s = ${this.reaction}s + 1
							WHERE id = $1
						`,
            [this.type_id]
          );
          await db.query(
            `
							UPDATE ${usersTable}
							SET ${this.reaction}s = ${this.reaction}s + 1
							WHERE user_id = $1
						`,
            [postComment.rows[0].user_id]
          );
        }
        return this;
      }
      await db.query(
        `
					INSERT INTO ${likesDislikesTable}(type, type_id, user_id, reaction)
					VALUES ($1, $2, $3, $4)
				`,
        [this.type, this.type_id, this.user_id, this.reaction]
      );
      await db.query(
        `
					UPDATE ${postsCommentsTable}
					SET ${this.reaction}s = ${this.reaction}s + 1
					WHERE id = $1
				`,
        [this.type_id]
      );
      await db.query(
        `
					UPDATE ${usersTable}
					SET ${this.reaction}s = ${this.reaction}s + 1
					WHERE user_id = $1
				`,
        [postComment.rows[0].user_id]
      );
      return this;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
  async get() {
    const { likesDislikesTable } = tableConfigManager.getConfig();
    try {
      const likeDislike = await db.query(
        `
					SELECT * FROM ${likesDislikesTable}
					WHERE type = $1 AND type_id = $2 AND user_id = $3
				`,
        [this.type, this.type_id, this.user_id]
      );
      if (likeDislike?.rows[0]) {
        return likeDislike?.rows[0];
      }
      throw new Error(`No ${this.reaction} here`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
