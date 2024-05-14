import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
	createCommentDislikesTable,
	createCommentLikesTable,
	createCommentsTable,
	createFriendshipTable,
	createPostDislikesTable, createPostLikesTable,
	createPostsTable, createUsersTable,
	dropCommentDislikesTable,
	dropCommentLikesTable,
	dropCommentsTable,
	dropPostDislikesTable,
	dropPostLikesTable,
	dropPostsTable,
} from './database/createTables';
import {signup} from './routes/auth/signup';
import {login} from './routes/auth/login';
import {logout} from './routes/auth/logout';
import {addPost} from './routes/post/addPost';
import {getPost} from './routes/post/getPost';
import {getPosts} from './routes/post/getPosts';
import {getPostsFromUser} from './routes/post/getPostsFromUser';
import {addComment} from './routes/comment/addComment';
import {getComment} from './routes/comment/getComment';
import {getComments} from './routes/comment/getComments';
import {getUser} from './routes/users/getUser';
import {getFriendship} from './routes/friendship/getFriendship';
import {getUsers} from './routes/users/getUsers';
import {getFriends} from './routes/users/getFriends';
import {getReplies} from './routes/comment/getReplies';
import {likeDislikeComment} from './routes/comment/likeDislikeComment';
import {likeDislikePost} from './routes/post/likeDislikePost';
import {validateUser} from './routes/auth/validateUser';
import {createFriendship} from './routes/friendship/createFriendship';
import {deleteFriendship} from './routes/friendship/deleteFriendship';

dotenv.config();

const app = express();
const {port, clientUrl} = process.env;

// Create database user table
await createUsersTable();

// Create database post tables
// await dropPostsTable();
// await dropPostLikesTable();
// await dropPostDislikesTable();

await createPostsTable();
await createPostLikesTable();
await createPostDislikesTable();

// Create database frienship table
await createFriendshipTable();

// Create database comment tables
// await dropCommentsTable();
// await dropCommentLikesTable();
// await dropCommentDislikesTable();

await createCommentsTable();
await createCommentLikesTable();
await createCommentDislikesTable();

// App settings
app.use(cors(clientUrl ? {origin: [clientUrl], credentials: true} : {credentials: true}));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Auth routes
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/validateUser', validateUser);

// Post routes
app.use('/addPost', addPost);
app.use('/getPosts', getPosts);
app.use('/getPost', getPost);
app.use('/getPostsFromUser', getPostsFromUser);
app.use('/likeDislikePost', likeDislikePost);

// Comments routes
app.use('/addComment', addComment);
app.use('/getComments', getComments);
app.use('/getReplies', getReplies);
app.use('/getComment', getComment);
app.use('/likeDislikeComment', likeDislikeComment);

// Users routes
app.use('/getUsers', getUsers);
app.use('/getUser', getUser);
app.use('/getFriends', getFriends);

// Friendship routes
app.use('/createFriendship', createFriendship);
app.use('/getFriendship', getFriendship);
app.use('/deleteFriendship', deleteFriendship);

app.listen(port, (): void => {
	console.log(`Server running on port ${port}`);
});
