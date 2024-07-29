import bcryptjs from 'bcryptjs';
import { Db, tableConfigManager } from '../database/db.database.js';
import { generateToken } from '../utilities/generateToken.utilities.js';
import { Friend } from './friend.model.js';
const db = new Db();
export class User {
    username;
    password;
    email;
    profile_picture;
    user_id;
    likes;
    dislikes;
    posts;
    comments;
    friends;
    created_at;
    last_online;
    friend_status;
    constructor(username, password, email, profile_picture, user_id, likes, dislikes, posts, comments, friends, created_at, last_online, friend_status) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.profile_picture = profile_picture;
        this.user_id = user_id;
        this.likes = likes;
        this.dislikes = dislikes;
        this.posts = posts;
        this.comments = comments;
        this.friends = friends;
        this.created_at = created_at;
        this.last_online = last_online;
        this.friend_status = friend_status;
    }
    async signup() {
        const { usersTable } = tableConfigManager.getConfig();
        try {
            if (this.password && this.username) {
                const existingUser = await db.query(`
						SELECT user_id from ${usersTable}
						WHERE username_lower_case = $1	
					`, [this.username.toLowerCase()]);
                if (existingUser?.rows[0]) {
                    throw new Error('User already exists');
                }
                this.password = await bcryptjs.hash(this.password, 10);
                const newUser = await db.query(`
						INSERT INTO ${usersTable}(username, username_lower_case, email, password, profile_picture)
						VALUES($1, $2, $3, $4, $5)
						RETURNING user_id, username, email, profile_picture, likes,
						dislikes, posts, comments, friends, created_at, last_online;
					`, [
                    this.username,
                    this.username.toLowerCase(),
                    this.email,
                    this.password,
                    this.profile_picture
                ]);
                const user = newUser?.rows[0];
                this.user_id = user.user_id;
                this.username = user.username;
                this.email = user.email;
                this.profile_picture = user.profile_picture;
                this.likes = user.likes;
                this.dislikes = user.dislikes;
                this.posts = user.posts;
                this.comments = user.comments;
                this.friends = user.friends;
                this.created_at = user.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : undefined;
                this.last_online = user.last_online
                    ? new Date(user.last_online).toLocaleString()
                    : undefined;
                return this;
            }
            else {
                throw new Error('Missing username and password');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    async login() {
        const { usersTable } = tableConfigManager.getConfig();
        try {
            if (this.username && this.password) {
                const db = new Db();
                const existingUser = await db.query(`
						SELECT user_id, password from ${usersTable}
						WHERE username = $1	
					`, [this.username]);
                if (!existingUser?.rows[0]) {
                    throw new Error('Incorrect user details');
                }
                const comparePassword = await bcryptjs.compare(this.password, existingUser?.rows[0].password);
                if (!comparePassword) {
                    throw new Error('Incorrect user details');
                }
                this.user_id = existingUser?.rows[0].user_id;
                return await this.get();
            }
            else {
                throw new Error('Missing username and password');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    async get(auth_user_id) {
        const { usersTable } = tableConfigManager.getConfig();
        try {
            const userFromDb = await db.query(`
					SELECT user_id, username, email, profile_picture, likes, dislikes,
					posts, comments, friends, created_at, last_online
					FROM ${usersTable}
					WHERE user_id = $1	
				`, [this.user_id]);
            if (!userFromDb?.rows[0]) {
                return undefined;
            }
            const user = userFromDb?.rows[0];
            if (auth_user_id) {
                const friend_status = await new Friend(undefined, auth_user_id, this.user_id).get();
                if (friend_status) {
                    this.friend_status = friend_status.friend_accepted
                        ? 'friend'
                        : 'waiting';
                }
                else {
                    this.friend_status = undefined;
                }
            }
            this.user_id = user.user_id;
            this.username = user.username;
            this.email = user.email;
            this.profile_picture = user.profile_picture;
            this.likes = user.likes;
            this.dislikes = user.dislikes;
            this.posts = user.posts;
            this.comments = user.comments;
            this.friends = user.friends;
            this.created_at = user.created_at
                ? new Date(user.created_at).toLocaleString()
                : undefined;
            this.last_online = user.last_online
                ? new Date(user.last_online).toLocaleString()
                : undefined;
            return this;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    async gets(page = 0, sort = `created_at`, auth_user_id, search, friends) {
        const { usersTable, friendsTable } = tableConfigManager.getConfig();
        try {
            let usersFromDb;
            const queryParams = search
                ? [this.user_id, `%${search.toLowerCase()}%`, 10, page * 10]
                : [this.user_id, 10, page * 10];
            if (friends) {
                usersFromDb = await db.query(`
						SELECT u.user_id, u.username, u.email, u.profile_picture, u.likes, u.dislikes,
						u.posts, u.comments, u.friends, u.created_at, u.last_online
						FROM ${usersTable} u
						JOIN ${friendsTable} f
						ON (f.friend_one_id = u.user_id OR friend_two_id = u.user_id)
						WHERE (f.friend_one_id = $1 OR f.friend_two_id = $1)
						${friends === 'friend' ? 'AND f.friend_accepted = true' : 'AND f.friend_accepted = false'}
						AND user_id != $1
						${search ? 'AND username_lower_case LIKE $2' : ''}
						ORDER BY ${sort} DESC
						LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
					`, queryParams);
            }
            else {
                usersFromDb = await db.query(`
						SELECT user_id, username, email, profile_picture, likes, dislikes,
						posts, comments, friends, created_at, last_online
						FROM ${usersTable}
						WHERE user_id != $1
						${search ? 'AND username_lower_case LIKE $2' : ''}
						ORDER BY ${sort} DESC
						LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
					`, queryParams);
            }
            if (!usersFromDb?.rows[0]) {
                return [];
            }
            const usersPromises = usersFromDb?.rows.map(async (user) => {
                return await new User(undefined, undefined, undefined, undefined, user.user_id).get(auth_user_id);
            });
            return Promise.all(usersPromises);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    async tokens() {
        try {
            if (this.user_id) {
                const accessToken = generateToken(this.user_id, 'access');
                const refreshToken = generateToken(this.user_id, 'refresh');
                return { accessToken, refreshToken };
            }
            else {
                throw new Error('No user_id found');
            }
        }
        catch (error) {
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
            posts: this.posts,
            comments: this.comments,
            friends: this.friends,
            created_at: this.created_at,
            last_online: this.last_online,
            friend_status: this.friend_status
        };
        return serializeUser;
    }
}
