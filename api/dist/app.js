import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
	createCommentDislikesTable, createCommentLikesTable, createCommentsTable, createFriendshipTable, createPostDislikesTable, createPostLikesTable, createPostsTable, createUsersTable,
} from './database/createTables.js';
import {signup} from './routes/auth/signup.js';
import {login} from './routes/auth/login.js';
import {logout} from './routes/auth/logout.js';
import {addPost} from './routes/post/addPost.js';
import {getPost} from './routes/post/getPost.js';
import {getPosts} from './routes/post/getPosts.js';
import {getPostsFromUser} from './routes/post/getPostsFromUser.js';
import {addComment} from './routes/comment/addComment.js';
import {getComment} from './routes/comment/getComment.js';
import {getComments} from './routes/comment/getComments.js';
import {getUser} from './routes/users/getUser.js';
import {getFriendship} from './routes/friendship/getFriendship.js';
import {getUsers} from './routes/users/getUsers.js';
import {getFriends} from './routes/users/getFriends.js';
import {getReplies} from './routes/comment/getReplies.js';
import {likeDislikeComment} from './routes/comment/likeDislikeComment.js';
import {likeDislikePost} from './routes/post/likeDislikePost.js';
import {validateUser} from './routes/auth/validateUser.js';
import {createFriendship} from './routes/friendship/createFriendship.js';
import {deleteFriendship} from './routes/friendship/deleteFriendship.js';
dotenv.config();
const app = express();
const {port, clientUrl} = process.env;
// Create database user table
await createUsersTable();
// Create database post tables
await createPostsTable();
await createPostLikesTable();
await createPostDislikesTable();
// Create database frienship table
await createFriendshipTable();
// Create database comment tables
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
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
