import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/getUser', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return user', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    const getUser = await request(app)
      .get('/getUser')
      .query({ user_id: 1 })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(getUser.body.username).toBe('testUser');
    expect(getUser.body.user_id).toBe(1);
    expect(getUser.body.email).toBe('test@email.com');
  });

  test('Should return error if no user id provided', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    const getUser = await request(app)
      .get('/getUser')
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(getUser.body).toEqual({ error: 'user_id required' });
  });
});
