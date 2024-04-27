import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {verifyToken} from './token/verifyToken';
import {signup} from './routes/signup';
import {login} from './routes/login';
import {createUsersTable} from './database/createTables';

dotenv.config();

const app = express();
const {port, clientUrl} = process.env;

// Create database tables
await createUsersTable();

// App settings
app.use(cors(clientUrl ? {origin: [clientUrl]} : {}));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/signup', signup);
app.use('/login', login);

app.get('/', verifyToken, (req, res) => {
	console.log('Welcome to voxieverse api');
	return res.json(res.locals.user);
});

app.listen(port, (): void => {
	console.log(`Server running on port ${port}`);
});
