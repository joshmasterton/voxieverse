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

  test('Should return success on post creation', async () => {
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
      .post('/createPost')
      .field({
        post: 'random post'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(response.body.post).toBe('Random post');
    expect(response.body.post_id).toBe(1);
    expect(response.body.post_picture).toBeDefined();
  });

  test('Should return success on post creation without image', async () => {
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
      .post('/createPost')
      .field({
        post: 'random post'
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(response.body.post).toBe('Random post');
    expect(response.body.post_id).toBe(1);
    expect(response.body.post_picture).toBeUndefined();
  });

  test('Should return error if post is empty or not existing', async () => {
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
      .post('/createPost')
      .field({
        post: ''
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(response.body.error).toBe('Post cannot be empty');
  });
});
