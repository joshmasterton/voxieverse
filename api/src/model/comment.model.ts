import { Db, tableConfigManager } from '../database/db.database';
import { SerializedComment } from '../../types/model/comment.model.types';
import { User } from './user.model';
import { Post } from './post.model';
import { QueryResult } from 'pg';
import { LikeDislike } from './likeDislike.model';

const db = new Db();

export class Comment {
  constructor(
    private auth_user_id?: number,
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
    private profile_picture?: string,
    private hasLiked = false,
    private hasDisliked = false
  ) {}

  async createComment() {
    const { postsTable, commentsTable } = tableConfigManager.getConfig();

    try {
      if (this.comment) {
        const post = new Post(undefined, undefined, this.post_id);
        const postFromDb = await post.get();

        if (!postFromDb) {
          throw new Error('No post found');
        }

        const commentFirstLetter = this.comment.slice(0, 1).toUpperCase();
        const commentRest = this.comment.slice(1);
        const updatedComment = commentFirstLetter + commentRest;

        if (this.comment_parent_id) {
          await db.query(
            `
							UPDATE ${commentsTable}
							SET comments = comments + 1
							WHERE comment_id = $1							
						`,
            [this.comment_parent_id]
          );
        } else {
          await db.query(
            `
							UPDATE ${postsTable}
							SET comments = comments + 1
							WHERE post_id = $1	
						`,
            [this.post_id]
          );
        }

        const createComment = await db.query(
          `
						INSERT INTO ${commentsTable}(user_id, post_id, comment, comment_parent_id)
						VALUES($1, $2, $3, $4) RETURNING comment_id
					`,
          [this.user_id, this.post_id, updatedComment, this.comment_parent_id]
        );

        this.comment_id = createComment?.rows[0].comment_id;
        await this.get();

        if (this.comment_parent_id) {
          const updatedComment = new Comment(
            this.auth_user_id,
            undefined,
            undefined,
            this.comment_parent_id
          );
          const updatedSerilizedComment = await updatedComment.get();

          return updatedSerilizedComment?.serializeComment();
        } else {
          const updatedPost = new Post(undefined, undefined, this.post_id);
          const updatedSerializedPost = await updatedPost.get();

          return updatedSerializedPost?.serializePost();
        }
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

      if (!commentFromDb?.rows[0]) {
        throw new Error('No comment found');
      }

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

      if (this.comment_id && this.auth_user_id) {
        const likedDisliked = new LikeDislike(
          'comment',
          this.comment_id,
          this.auth_user_id
        );
        const hasLikedDisliked = await likedDisliked.hasLikedDisliked();

        if (hasLikedDisliked === 'like') {
          this.hasLiked = true;
        } else if (hasLikedDisliked === 'dislike') {
          this.hasDisliked = true;
        }
      }

      return this;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async getComments(page = 0) {
    const { commentsTable } = tableConfigManager.getConfig();

    const post = new Post(undefined, undefined, this.post_id);
    const postFromDb = await post.get();

    if (!postFromDb) {
      throw new Error('No post found');
    }

    try {
      let commentsFromDb: QueryResult | undefined;

      if (this.comment_parent_id) {
        commentsFromDb = await db.query(
          `
						SELECT * FROM ${commentsTable}
						WHERE post_id = $1
						AND comment_parent_id = $2
						ORDER BY created_at DESC
						LIMIT $3 OFFSET $4
					`,
          [
            postFromDb.serializePost().post_id,
            this.comment_parent_id,
            10,
            page * 10
          ]
        );
      } else {
        commentsFromDb = await db.query(
          `
						SELECT * FROM ${commentsTable}
						WHERE post_id = $1
						AND comment_parent_id IS NULL
						ORDER BY created_at DESC
						LIMIT $2 OFFSET $3
					`,
          [postFromDb.serializePost().post_id, 10, page * 10]
        );
      }

      if (!commentsFromDb?.rows) {
        throw new Error('No comments found');
      }

      const commentsPromise = commentsFromDb?.rows.map(
        async (commentPromise: Comment) => {
          try {
            const commentInstance = new Comment();
            commentInstance.auth_user_id = this.auth_user_id;
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
      created_at: this.created_at,
      hasLiked: this.hasLiked,
      hasDisliked: this.hasDisliked
    };

    return serializePost;
  }
}
