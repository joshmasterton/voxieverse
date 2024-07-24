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
    const { postsCommentsTable, usersTable } = tableConfigManager.getConfig();

    const splitFirstLetterText = this.text?.slice(0, 1).toUpperCase() as string;
    const splitRestText = this.text?.slice(1) as string;

    const updatedText = splitFirstLetterText + splitRestText;

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
          updatedText,
          this.picture
        ]
      );

      await db.query(
        `
					UPDATE ${usersTable}
					SET comments = comments + 1
					WHERE user_id = $1
				`,
        [this.user_id]
      );

      if (this.post_parent_id) {
        await db.query(
          `
						UPDATE ${postsCommentsTable}
						SET comments = comments + 1
						WHERE id = $1
					`,
          [this.post_parent_id]
        );
      }

      if (this.comment_parent_id) {
        await db.query(
          `
						UPDATE ${postsCommentsTable}
						SET comments = comments + 1
						WHERE id = $1
					`,
          [this.comment_parent_id]
        );
      }

      this.id = postComment?.rows[0].id;

      return this;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async get(auth_user_id?: number) {
    const { usersTable, postsCommentsTable, likesDislikesTable } =
      tableConfigManager.getConfig();

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
        [postComment.rows[0].user_id]
      );

      if (!user?.rows[0]) {
        throw new Error('No user found');
      }

      const likeDislike = await db.query(
        `
					SELECT * FROM ${likesDislikesTable}
					WHERE type_id = $1 AND user_id = $2
				`,
        [this.id, auth_user_id]
      );

      if (likeDislike?.rows[0]) {
        if (likeDislike.rows[0].reaction === 'like') {
          this.has_liked = true;
        } else if (likeDislike.rows[0].reaction === 'dislike') {
          this.has_disliked = true;
        }
      }

      const seconds = Math.floor(
        (Date.now() - new Date(postComment?.rows[0].created_at).getTime()) /
          1000
      );

      this.created_at = 'Just now';

      let interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        this.created_at = `${interval}d`;
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          this.created_at = `${interval}hr`;
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            this.created_at = `${interval}m`;
          }
        }
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

  async gets(
    page = 0,
    sort = 'created_at',
    auth_user_id?: number,
    profile_id?: number
  ) {
    const { postsCommentsTable } = tableConfigManager.getConfig();

    try {
      let postsComments: QueryResult | undefined;

      if (profile_id) {
        postsComments = await db.query(
          `
						SELECT * FROM ${postsCommentsTable}
						WHERE type = $1
						AND user_id = $2
						ORDER BY ${sort} DESC
						LIMIT $3 OFFSET $4
					`,
          [this.type, profile_id, 10, page * 10]
        );
      } else if (this.post_parent_id && this.comment_parent_id) {
        postsComments = await db.query(
          `
						SELECT * FROM ${postsCommentsTable}
						WHERE type = $1
						AND post_parent_id = $2
						AND comment_parent_id = $3
						ORDER BY ${sort} DESC
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
						ORDER BY ${sort} DESC
						LIMIT $3 OFFSET $4
					`,
          [this.type, this.post_parent_id, 10, page * 10]
        );
      } else {
        postsComments = await db.query(
          `
						SELECT * FROM ${postsCommentsTable}
						WHERE type = $1
						ORDER BY ${sort} DESC
						LIMIT $2 OFFSET $3
					`,
          [this.type, 10, page * 10]
        );
      }

      if (!postsComments?.rows[0]) {
        return [];
      }

      const postsCommentsPromises = postsComments?.rows.map(
        async (postComment: PostComment) => {
          return await new PostComment(
            postComment.id,
            undefined,
            undefined,
            postComment.user_id
          ).get(auth_user_id);
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
