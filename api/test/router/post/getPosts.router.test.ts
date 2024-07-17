import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/createPost', async () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return posts with user data', async () => {
    await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const responseLogin = await request(app).post('/login').send({
      username: 'testUser',
      password: 'Password'
    });

    await request(app)
      .post('/createPost')
      .field({
        post: 'random post'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    await request(app)
      .post('/createPost')
      .field({
        post: 'random post two'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const response = await request(app)
      .get('/getPosts')
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(response.body).toHaveLength(2);
  });

  test('Should return posts with user data', async () => {
    await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const responseLogin = await request(app).post('/login').send({
      username: 'testUser',
      password: 'Password'
    });

    const response = await request(app)
      .get('/getPosts')
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(response.body).toHaveLength(0);
  });
});
