import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { Db } from './database/db.database';
import { login } from './router/auth/login.router';
import { signup } from './router/auth/signup.router';
import { authenticate } from './middleware/authenticate.middleware';
import { logout } from './router/auth/logout.router';
import { createPostComment } from './router/postComment/createPostComment.router';
import { getPostComment } from './router/postComment/getPostComment.router';
import { getPostsComments } from './router/postComment/getPostsComments.router';
import { likeDislike } from './router/likeDislike/createLikeDislike.router';
import { getUser } from './router/user/getUser.router';
import { getUsers } from './router/user/getUsers.router';
import { addFriend } from './router/friend/addFriend.router';
import { getFriend } from './router/friend/getFriend.router';
import { removeFriend } from './router/friend/removeFriend.router';
dotenv.config();

export const app = express();
const { NODE_ENV, CLIENT_URL, PORT } = process.env;
const db = new Db();

if (NODE_ENV !== 'test') {
  db.createUsers();
  db.createPostsComments();
  db.createLikesDislikes();
  db.createFriends();
}

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', authenticate, (_req, res) => {
  if (res.locals.user) {
    return res.json(res.locals.user);
  } else {
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

app.use(addFriend());
app.use(getFriend());
app.use(removeFriend());

app.use(likeDislike());

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Listening to server in dev mode on port ${PORT}`);
  });
}
