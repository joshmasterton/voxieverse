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
import { updateUser } from './router/auth/updateUser.router';
import { createPostComment } from './router/postComment/createPostComment.router';
import { getPostComment } from './router/postComment/getPostComment.router';
import { getPostsComments } from './router/postComment/getPostsComments.router';
import { likeDislike } from './router/likeDislike/createLikeDislike.router';
import { getUser } from './router/user/getUser.router';
import { getUsers } from './router/user/getUsers.router';
import { addFriend } from './router/friend/addFriend.router';
import { getFriend } from './router/friend/getFriend.router';
import { removeFriend } from './router/friend/removeFriend.router';
import rateLimit from 'express-rate-limit';

export const app = express();
const { NODE_ENV, CLIENT_URL, PORT } = process.env;

dotenv.config({
  path: NODE_ENV === 'development' ? '../.env.dev' : '../.env.prod'
});

const db = new Db();
const origin = ['https://www.zonomaly.com', 'https://zonomaly.com'];

if (NODE_ENV !== 'test') {
  db.createUsers();
  db.createPostsComments();
  db.createLikesDislikes();
  db.createFriends();
}

app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    legacyHeaders: false
  })
);
app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL ? [CLIENT_URL, ...origin] : origin,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/voxieverse', authenticate, (_req, res) => {
  if (res.locals.user) {
    return res.json(res.locals.user);
  } else {
    return res.status(403).json({ error: 'Unauthorized' });
  }
});

app.use('/voxieverse', login());
app.use('/voxieverse', signup());
app.use('/voxieverse', logout());
app.use('/voxieverse', updateUser());

app.use('/voxieverse', createPostComment());
app.use('/voxieverse', getPostComment());
app.use('/voxieverse', getPostsComments());

app.use('/voxieverse', getUser());
app.use('/voxieverse', getUsers());

app.use('/voxieverse', addFriend());
app.use('/voxieverse', getFriend());
app.use('/voxieverse', removeFriend());

app.use('/voxieverse', likeDislike());

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Listening to server in dev mode on port ${PORT}`);
  });
}
