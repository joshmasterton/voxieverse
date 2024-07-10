import express from 'express';
import { Db } from './database/db.database';
import { login } from './router/auth/login.router';
import { signup } from './router/auth/signup.router';
import dotenv from 'dotenv';
dotenv.config({ path: './src/env/dev.env' });

export const app = express();
const { NODE_ENV } = process.env;
const db = new Db();

if (NODE_ENV !== 'test') {
  db.dropUsers();
  db.createUsers();
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req, res) => {
  return res.json({ message: 'Voxieverse' });
});

app.use(login());
app.use(signup());

if (NODE_ENV !== 'test') {
  app.listen(9001, () => {
    console.log('Listening to server in dev mode on port 9001');
  });
}
