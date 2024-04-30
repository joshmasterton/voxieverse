import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {signup} from './routes/auth/signup';
import {login} from './routes/auth/login';
import {logout} from './routes/auth/logout';
import {validateUser} from './routes/auth/validateUser';
import {createUsersTable} from './database/createTables';

dotenv.config();

const app = express();
const {port, clientUrl} = process.env;

// Create database tables
await createUsersTable();

// App settings
app.use(cors(clientUrl ? {origin: [clientUrl], credentials: true} : {credentials: true}));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/signup', signup);
app.use('/login', login);
app.use('/logout', logout);
app.use('/validateUser', validateUser);

app.listen(port, (): void => {
	console.log(`Server running on port ${port}`);
});
