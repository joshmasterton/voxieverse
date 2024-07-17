import { Db, tableConfigManager } from '../database/db.database';
import { SerializedComment } from '../../types/model/comment.model.types';
import { User } from './user.model';
import { Post } from './post.model';

const db = new Db();

export class Comment {
  constructor(
    private user_id?: number,
    private post_id?: number,
    private comment_id?: number,
    private comment_parent_id?: number,
    private comment?: string,
    private likes?: number,
    private dislikes?: number,
    private comments?: number,
    private created_at?: string,
    private username?: string,
    private profile_picture?: string
  ) {}

  async createComment() {
    const { commentsTable } = tableConfigManager.getConfig();

    try {
      if (this.comment) {
        const post = new Post(undefined, this.post_id);
        await post.get();

        const commentFirstLetter = this.comment.slice(0, 1).toUpperCase();
        const commentRest = this.comment.slice(1);
        const updatedComment = commentFirstLetter + commentRest;

        const createComment = await db.query(
          `
							INSERT INTO ${commentsTable}(user_id, post_id, comment, comment_parent_id)
							VALUES($1, $2, $3, $4) RETURNING *
						`,
          [this.user_id, this.post_id, updatedComment, this.comment_parent_id]
        );

        const comment = createComment?.rows[0] as Comment;

        this.comment = comment.comment;
        this.user_id = comment.user_id;
        this.post_id = comment.post_id;
        this.comment_id = comment.comment_id;
        this.comment_parent_id = comment.comment_parent_id;
        this.likes = comment.likes;
        this.dislikes = comment.dislikes;
        this.comments = comment.comments;
        this.created_at = comment.created_at;

        return this;
      } else {
        throw new Error('Comment required');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async get() {
    const { commentsTable } = tableConfigManager.getConfig();

    try {
      const commentFromDb = await db.query(
        `
					SELECT * FROM ${commentsTable}
					WHERE comment_id = $1
				`,
        [this.comment_id]
      );

      const comment = commentFromDb?.rows[0] as Comment;

      this.comment = comment.comment;
      this.comment_id = comment.comment_id;
      this.comment_parent_id = comment.comment_parent_id;
      this.post_id = comment.post_id;
      this.user_id = comment.user_id;
      this.likes = comment.likes;
      this.dislikes = comment.dislikes;
      this.comments = comment.comments;
      this.created_at = comment.created_at
        ? new Date(comment.created_at).toLocaleString()
        : undefined;

      const user = new User(
        undefined,
        undefined,
        undefined,
        undefined,
        this.user_id
      );

      await user.get();
      const serailizedUser = user.serializeUser();

      this.username = serailizedUser.username;
      this.profile_picture = serailizedUser.profile_picture;

      return this;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async getComments(page = 0) {
    const { commentsTable } = tableConfigManager.getConfig();

    try {
      const commentsFromDb = await db.query(
        `
					SELECT * FROM ${commentsTable}
					ORDER BY created_at DESC
					LIMIT $1 OFFSET $2
				`,
        [10, page * 10]
      );

      if (!commentsFromDb?.rows) {
        throw new Error('No comments found');
      }

      const commentsPromise = commentsFromDb?.rows.map(
        async (commentPromise: Comment) => {
          try {
            const commentInstance = new Comment();
            commentInstance.comment = commentPromise.comment;
            commentInstance.comment_id = commentPromise.comment_id;
            commentInstance.comment_parent_id =
              commentPromise.comment_parent_id;
            commentInstance.post_id = commentPromise.post_id;
            commentInstance.user_id = commentPromise.user_id;
            commentInstance.likes = commentPromise.likes;
            commentInstance.dislikes = commentPromise.dislikes;
            commentInstance.comments = commentPromise.comments;
            commentInstance.created_at = commentPromise.created_at;

            await commentInstance.get();
            return commentInstance.serializeComment();
          } catch (error) {
            if (error instanceof Error) {
              return null;
            }
          }
        }
      );

      const comments = await Promise.all(commentsPromise);
      return comments.filter((comment) => comment !== null);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  serializeComment() {
    const serializePost: SerializedComment = {
      comment: this.comment,
      post_id: this.post_id,
      comment_id: this.comment_id,
      comment_parent_id: this.comment_parent_id,
      user_id: this.user_id,
      username: this.username,
      profile_picture: this.profile_picture,
      likes: this.likes,
      dislikes: this.dislikes,
      comments: this.comments,
      created_at: this.created_at
    };

    return serializePost;
  }
}
