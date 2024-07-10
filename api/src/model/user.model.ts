import { Db } from '../database/db.database';
import { getTestUsersTable } from '../../vitest.setup';

export class User {
  constructor(
    private username: string,
    private email: string,
    private password: string,
    private profile_picture: string,
    private user_id?: number,
    private likes?: number,
    private dislikes?: number,
    private comments?: number,
    private friends?: number,
    private created_at?: Date,
    private last_online?: Date
  ) {}

  async create(
    usersTable = getTestUsersTable() || 'voxieverse_users'
  ): Promise<User | undefined> {
    try {
      const db = new Db();
      const result = await db.query(
        `
					INSERT INTO ${usersTable}(username, username_lower_case, email, password, profile_picture)
					VALUES($1, $2, $3, $4, $5)
					RETURNING user_id, username, email, profile_picture, likes, dislikes, comments, friends, created_at, last_online;
				`,
        [
          this.username,
          this.username.toLowerCase(),
          this.email,
          this.password,
          this.profile_picture
        ]
      );

      const {
        user_id,
        username,
        email,
        profile_picture,
        likes,
        dislikes,
        comments,
        friends,
        created_at,
        last_online
      } = result?.rows[0] as User;

      this.user_id = user_id;
      this.username = username;
      this.email = email;
      this.profile_picture = profile_picture;
      this.likes = likes;
      this.dislikes = dislikes;
      this.comments = comments;
      this.friends = friends;
      this.created_at = created_at;
      this.last_online = last_online;

      return this;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  serializeUser() {
    const serializeUser = {
      user_id: this.user_id,
      username: this.username,
      email: this.email,
      profile_picture: this.profile_picture,
      likes: this.likes,
      dislikes: this.dislikes,
      comments: this.comments,
      friends: this.friends,
      created_at: this.created_at,
      last_online: this.last_online
    };

    return serializeUser;
  }
}
