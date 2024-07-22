import { QueryResult } from 'pg';
import { Db, tableConfigManager } from '../database/db.database';

const db = new Db();

export class PostComment {
  constructor(
    private id?: number,
    private post_parent_id?: number,
    private comment_parent_id?: number,
    private user_id?: number,
    private type?: string,
    private text?: string,
    private picture?: string,
    private likes?: number,
    private dislikes?: number,
    private comments?: number,
    private created_at?: string,
    private username?: string,
    private profile_picture?: string,
    private has_liked?: boolean,
    private has_disliked?: boolean
  ) {}

  async create() {
    const { postsCommentsTable } = tableConfigManager.getConfig();

    try {
      const postComment = await db.query(
        `
					INSERT INTO ${postsCommentsTable}(post_parent_id, comment_parent_id, user_id, type, text, picture)
					VALUES ($1, $2, $3, $4, $5, $6)
					RETURNING id
				`,
        [
          this.post_parent_id,
          this.comment_parent_id,
          this.user_id,
          this.type,
          this.text,
          this.picture
        ]
      );

      this.id = postComment?.rows[0].id;

      return this;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async get() {
    const { usersTable, postsCommentsTable } = tableConfigManager.getConfig();

    try {
      const postComment = await db.query(
        `
					SELECT * FROM ${postsCommentsTable}
					WHERE id = $1
				`,
        [this.id]
      );

      if (!postComment?.rows[0]) {
        throw new Error(`No ${this.type} found`);
      }

      const user = await db.query(
        `
					SELECT username, profile_picture FROM ${usersTable}
					WHERE user_id = $1
				`,
        [this.user_id]
      );

      if (!user?.rows[0]) {
        throw new Error('No user found');
      }

      this.id = postComment?.rows[0].id;
      this.post_parent_id = postComment?.rows[0].post_parent_id;
      this.comment_parent_id = postComment?.rows[0].comment_parent_id;
      this.user_id = postComment?.rows[0].user_id;
      this.type = postComment?.rows[0].type;
      this.text = postComment?.rows[0].text;
      this.picture = postComment?.rows[0].picture;
      this.likes = postComment?.rows[0].likes;
      this.dislikes = postComment?.rows[0].dislikes;
      this.comments = postComment?.rows[0].comments;
      this.created_at = new Date(
        postComment?.rows[0].created_at
      ).toLocaleString();
      this.username = user.rows[0].username;
      this.profile_picture = user.rows[0].profile_picture;

      return {
        id: this.id,
        post_parent_id: this.post_parent_id,
        comment_parent_id: this.comment_parent_id,
        user_id: this.user_id,
        type: this.type,
        text: this.text,
        picture: this.picture,
        likes: this.likes,
        dislikes: this.dislikes,
        comments: this.comments,
        created_at: this.created_at,
        username: this.username,
        profile_picture: this.profile_picture,
        has_liked: this.has_liked,
        has_disliked: this.has_disliked
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async gets(page = 0, sort = 'likes') {
    const { postsCommentsTable } = tableConfigManager.getConfig();

    try {
      let postsComments: QueryResult | undefined;

      if (this.post_parent_id && this.comment_parent_id) {
        postsComments = await db.query(
          `
						SELECT * FROM ${postsCommentsTable}
						WHERE type = $1
						AND post_parent_id = $2
						AND comment_parent_id = $3
						ORDER BY ${sort}, created_at DESC
						LIMIT $4 OFFSET $5
					`,
          [
            this.type,
            this.post_parent_id,
            this.comment_parent_id,
            10,
            page * 10
          ]
        );
      } else if (this.post_parent_id) {
        postsComments = await db.query(
          `
						SELECT * FROM ${postsCommentsTable}
						WHERE type = $1 AND post_parent_id = $2
						AND comment_parent_id IS NULL
						ORDER BY ${sort}, created_at DESC
						LIMIT $3 OFFSET $4
					`,
          [this.type, this.post_parent_id, 10, page * 10]
        );
      } else {
        postsComments = await db.query(
          `
						SELECT * FROM ${postsCommentsTable}
						WHERE type = $1
						ORDER BY ${sort}, created_at DESC
						LIMIT $2 OFFSET $3
					`,
          [this.type, 10, page * 10]
        );
      }

      if (!postsComments?.rows[0]) {
        throw new Error('No posts');
      }

      const postsCommentsPromises = postsComments?.rows.map(
        async (postComment: PostComment) => {
          return await new PostComment(
            postComment.id,
            undefined,
            undefined,
            postComment.user_id
          ).get();
        }
      );

      return Promise.all(postsCommentsPromises);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
