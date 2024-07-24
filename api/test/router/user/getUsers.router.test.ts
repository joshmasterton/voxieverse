import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/getUsers', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return users', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    await request(app)
      .post('/signup')
      .field({
        username: 'testUserTwo',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    const getUsers = await request(app)
      .get('/getUsers')
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(getUsers.body).toHaveLength(2);
  });
});
