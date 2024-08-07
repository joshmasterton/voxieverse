import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/voxieverse/getUsers', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return users', async () => {
    const signup = await request(app)
      .post('/voxieverse/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    await request(app)
      .post('/voxieverse/signup')
      .field({
        username: 'testUserTwo',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    await request(app)
      .post('/voxieverse/signup')
      .field({
        username: 'testUserThree',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/voxieverse/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    const getUsers = await request(app)
      .get('/voxieverse/getUsers')
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(getUsers.body).toHaveLength(2);
  });

  test('Should reutrn empty if no users', async () => {
    const signup = await request(app)
      .post('/voxieverse/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/voxieverse/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    const getUsers = await request(app)
      .get('/voxieverse/getUsers')
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(getUsers.body).toHaveLength(0);
  });
});
