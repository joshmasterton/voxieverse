import express, {type Request, type Response, type Express} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const {port} = process.env;

app.get('/', (req: Request, res: Response): Response => {
	console.log('Welcome to social api');
	return res.send('Welcome to social api');
});

app.listen(port, (): void => {
	console.log(`Server running on port ${port}`);
});
