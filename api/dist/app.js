import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { Db } from './database/db.database.js';
import { login } from './router/auth/login.router.js';
import { signup } from './router/auth/signup.router.js';
import { authenticate } from './middleware/authenticate.middleware.js';
import { logout } from './router/auth/logout.router.js';
import { createPostComment } from './router/postComment/createPostComment.router.js';
import { getPostComment } from './router/postComment/getPostComment.router.js';
import { getPostsComments } from './router/postComment/getPostsComments.router.js';
import { likeDislike } from './router/likeDislike/createLikeDislike.router.js';
import { getUser } from './router/user/getUser.router.js';
import { getUsers } from './router/user/getUsers.router.js';
dotenv.config();
export const app = express();
const { NODE_ENV, CLIENT_URL, PORT } = process.env;
const db = new Db();
if (NODE_ENV !== 'test') {
    db.createUsers();
    db.createPostsComments();
    db.createLikesDislikes();
}
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100
}));
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', authenticate, (_req, res) => {
    if (res.locals.user) {
        return res.json(res.locals.user);
    }
    else {
        return res.status(403).json({ error: 'Unauthorized' });
    }
});
app.use(login());
app.use(signup());
app.use(logout());
app.use(createPostComment());
app.use(getPostComment());
app.use(getPostsComments());
app.use(getUser());
app.use(getUsers());
app.use(likeDislike());
if (NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Listening to server in dev mode on port ${PORT}`);
    });
}
