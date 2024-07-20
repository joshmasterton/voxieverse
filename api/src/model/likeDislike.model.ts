import { Db, tableConfigManager } from '../database/db.database';
import { Post } from './post.model';
import { Comment } from './comment.model';

const db = new Db();

export class LikeDislike {
  constructor(
    private type: string,
    private type_id: number,
    private user_id: number,
    private reaction?: string
  ) {}

  async create() {
    const { postsTable, commentsTable, likeDislikeTable } =
      tableConfigManager.getConfig();

    try {
      const existingLikeDislike = await db.query(
        `
					SELECT * FROM ${likeDislikeTable}
					WHERE type = $1 AND type_id = $2 AND user_id = $3
				`,
        [this.type, this.type_id, this.user_id]
      );

      if (existingLikeDislike?.rows[0]) {
        if (existingLikeDislike.rows[0].reaction === this.reaction) {
          await db.query(
            `
							DELETE FROM ${likeDislikeTable}
							WHERE type = $1 AND type_id = $2 AND user_id = $3
						`,
            [this.type, this.type_id, this.user_id]
          );

          if (this.type === 'post') {
            await db.query(
              `
								UPDATE ${postsTable}
								SET ${this.reaction}s = ${this.reaction}s - 1
								WHERE post_id = $1
							`,
              [this.type_id]
            );
          } else if (this.type === 'comment') {
            await db.query(
              `
								UPDATE ${commentsTable}
								SET ${this.reaction}s = ${this.reaction}s - 1
								WHERE comment_id = $1
							`,
              [this.type_id]
            );
          }
        } else {
          const oppositeReaction =
            this.reaction === 'like' ? 'dislike' : 'like';

          await db.query(
            `
              UPDATE ${likeDislikeTable}
              SET reaction = $1
              WHERE type = $2 AND type_id = $3 AND user_id = $4
            `,
            [this.reaction, this.type, this.type_id, this.user_id]
          );

          if (this.type === 'post') {
            await db.query(
              `
                UPDATE ${postsTable}
                SET ${this.reaction}s = ${this.reaction}s + 1, ${oppositeReaction}s = ${oppositeReaction}s - 1
                WHERE post_id = $1
              `,
              [this.type_id]
            );
          } else if (this.type === 'comment') {
            await db.query(
              `
                UPDATE ${commentsTable}
                SET ${this.reaction}s = ${this.reaction}s + 1, ${oppositeReaction}s = ${oppositeReaction}s - 1
                WHERE comment_id = $1
              `,
              [this.type_id]
            );
          }

          await db.query(
            `
							INSERT INTO ${likeDislikeTable}(type, type_id, user_id, reaction)
							VALUES($1, $2, $3, $4) RETURNING *
						`,
            [this.type, this.type_id, this.user_id, this.reaction]
          );
        }
      } else {
        if (this.type === 'post') {
          await db.query(
            `
							UPDATE ${postsTable}
							SET ${this.reaction}s = ${this.reaction}s + 1
							WHERE post_id = $1
						`,
            [this.type_id]
          );
        } else if (this.type === 'comment') {
          await db.query(
            `
							UPDATE ${commentsTable}
							SET ${this.reaction}s = ${this.reaction}s + 1
							WHERE comment_id = $1
						`,
            [this.type_id]
          );
        }

        await db.query(
          `
						INSERT INTO ${likeDislikeTable}(type, type_id, user_id, reaction)
						VALUES($1, $2, $3, $4) RETURNING *
					`,
          [this.type, this.type_id, this.user_id, this.reaction]
        );
      }

      return await this.get();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async get() {
    try {
      if (this.type === 'post') {
        const post = new Post(this.user_id, undefined, this.type_id);
        const postFromDb = await post.get();

        return postFromDb?.serializePost();
      } else if (this.type === 'comment') {
        const comment = new Comment(
          this.user_id,
          undefined,
          undefined,
          this.type_id
        );
        const commentFromDb = await comment.get();

        return commentFromDb?.serializeComment();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async hasLikedDisliked() {
    const { likeDislikeTable } = tableConfigManager.getConfig();

    try {
      const existingLikeDislike = await db.query(
        `
					SELECT * FROM ${likeDislikeTable}
					WHERE type = $1 AND type_id = $2 AND user_id = $3
				`,
        [this.type, this.type_id, this.user_id]
      );

      if (existingLikeDislike?.rows[0]) {
        return existingLikeDislike?.rows[0].reaction;
      }

      return undefined;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
