import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
	createPostDislikesTable, createPostLikesTable,
	createPostsTable, createUsersTable,
	dropPostDislikesTable, dropPostLikesTable, dropPostsTable,
} from './database/createTables';
import {signup} from './routes/auth/signup';
import {login} from './routes/auth/login';
import {logout} from './routes/auth/logout';
import {addPost} from './routes/post/addPost';
import {getPosts} from './routes/post/getPosts';
import {getPostsFromUser} from './routes/post/getPostsFromUser';
import {getContact} from './routes/users/getContact';
import {getUsers} from './routes/users/getUsers';
import {likeDislikePost} from './routes/post/likeDislikePost';
import {validateUser} from './routes/auth/validateUser';

dotenv.config();

const app = express();
const {port, clientUrl} = process.env;

// Create database tables
await createUsersTable();
await createPostsTable();
await createPostLikesTable();
await createPostDislikesTable();

// App settings
app.use(cors(clientUrl ? {origin: [clientUrl], credentials: true} : {credentials: true}));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Auth Routes
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/validateUser', validateUser);

// Post Routes
app.use('/addPost', addPost);
app.use('/getPosts', getPosts);
app.use('/getPostsFromUser', getPostsFromUser);
app.use('/likeDislikePost', likeDislikePost);

// Users routes
app.use('/getUsers', getUsers);
app.use('/getContact', getContact);

app.listen(port, (): void => {
	console.log(`Server running on port ${port}`);
});
