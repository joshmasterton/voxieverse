import { Db, tableConfigManager } from '../database/db.database';
import { SerializedPost } from '../../types/model/post.model.types';
import { User } from './user.model';

const db = new Db();

export class Post {
  constructor(
    private user_id?: number,
    private post_id?: number,
    private post?: string,
    private post_picture?: string,
    private likes?: number,
    private dislikes?: number,
    private comments?: number,
    private created_at?: string,
    private username?: string,
    private profile_picture?: string
  ) {}

  async createPost() {
    const { postsTable } = tableConfigManager.getConfig();

    try {
      if (this.post) {
        const postFirstLetter = this.post.slice(0, 1).toUpperCase();
        const postRest = this.post.slice(1);
        const updatedPost = postFirstLetter + postRest;

        if (this.post_picture) {
          const createPost = await db.query(
            `
							INSERT INTO ${postsTable}(user_id, post, post_picture)
							VALUES($1, $2, $3) RETURNING *
						`,
            [this.user_id, updatedPost, this.post_picture]
          );

          const post = createPost?.rows[0] as Post;

          this.post = post.post;
          this.post_id = post.post_id;
          this.user_id = post.user_id;
          this.post_picture = post.post_picture;
          this.likes = post.likes;
          this.dislikes = post.dislikes;
          this.comments = post.comments;
          this.created_at = post.created_at;

          return this;
        } else {
          const createPost = await db.query(
            `
							INSERT INTO ${postsTable}(user_id, post)
							VALUES($1, $2) RETURNING *
						`,
            [this.user_id, updatedPost]
          );

          const post = createPost?.rows[0] as Post;

          this.post = post.post;
          this.post_id = post.post_id;
          this.user_id = post.user_id;
          this.post_picture = undefined;
          this.likes = post.likes;
          this.dislikes = post.dislikes;
          this.comments = post.comments;
          this.created_at = post.created_at;

          return this;
        }
      } else {
        throw new Error('Post required');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async get() {
    const { postsTable } = tableConfigManager.getConfig();

    try {
      const postFromDb = await db.query(
        `
					SELECT * FROM ${postsTable}
					WHERE post_id = $1
				`,
        [this.post_id]
      );

      const post = postFromDb?.rows[0] as Post;

      this.post = post.post;
      this.post_id = post.post_id;
      this.user_id = post.user_id;
      this.post_picture = post.post_picture;
      this.likes = post.likes;
      this.dislikes = post.dislikes;
      this.comments = post.comments;
      this.created_at = post.created_at
        ? new Date(post.created_at).toLocaleString()
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

  async getPosts(page = 0) {
    const { postsTable } = tableConfigManager.getConfig();

    try {
      const postsFromDb = await db.query(
        `
					SELECT * FROM ${postsTable}
					ORDER BY created_at DESC
					LIMIT $1 OFFSET $2
				`,
        [10, page * 10]
      );

      if (!postsFromDb?.rows) {
        throw new Error('No posts found');
      }

      const postsPromise = postsFromDb?.rows.map(async (postPromise: Post) => {
        try {
          const postInstance = new Post();
          postInstance.post = postPromise.post;
          postInstance.post_id = postPromise.post_id;
          postInstance.user_id = postPromise.user_id;
          postInstance.post_picture = postPromise.post_picture;
          postInstance.likes = postPromise.likes;
          postInstance.dislikes = postPromise.dislikes;
          postInstance.comments = postPromise.comments;
          postInstance.created_at = postPromise.created_at;

          await postInstance.get();
          return postInstance.serializePost();
        } catch (error) {
          if (error instanceof Error) {
            return null;
          }
        }
      });

      const posts = await Promise.all(postsPromise);
      return posts.filter((post) => post !== null);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  serializePost() {
    const serializePost: SerializedPost = {
      post: this.post,
      post_id: this.post_id,
      user_id: this.user_id,
      username: this.username,
      profile_picture: this.profile_picture,
      post_picture: this.post_picture,
      likes: this.likes,
      dislikes: this.dislikes,
      comments: this.comments,
      created_at: this.created_at
    };

    return serializePost;
  }
}
