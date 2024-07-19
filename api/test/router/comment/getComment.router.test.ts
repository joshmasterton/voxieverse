import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/getComment', async () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return comment with user data', async () => {
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

    await request(app)
      .post('/createComment')
      .send({
        comment: 'random comment',
        post_id: responsePost.body.post_id
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const responseGetComment = await request(app)
      .get('/getComment')
      .query({ comment_id: 1 })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(responseGetComment.body.comment_id).toEqual(1);
    expect(responseGetComment.body.post_id).toEqual(1);
    expect(responseGetComment.body.user_id).toEqual(1);
  });

  test('Should return error if no comment_id', async () => {
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

    const response = await request(app)
      .get('/getComment')
      .query({})
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(response.body).toEqual({ error: 'comment_id required' });
  });
});
