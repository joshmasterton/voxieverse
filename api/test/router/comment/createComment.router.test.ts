import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/createComment', async () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return success on comment creation', async () => {
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

    const responsePost = await request(app)
      .post('/createPost')
      .field({
        post: 'random post'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const response = await request(app)
      .post('/createComment')
      .send({
        post_id: responsePost.body.post_id,
        comment_parent_id: 0,
        comment: 'random comment'
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(response.body.post_id).toBe(1);
    expect(response.body.comments).toBe(1);
  });

  test('Should return error if comment is empty or not existing', async () => {
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
      .post('/createComment')
      .send({
        post_id: 0,
        comment: ''
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(response.body.error).toBe('Comment cannot be empty');
  });

  test('Should return error if no post', async () => {
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
      .post('/createComment')
      .send({
        post_id: 0,
        comment_parent_id: 0,
        comment: 'random comment'
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(response.body).toEqual({ error: 'No post found' });
  });
});
