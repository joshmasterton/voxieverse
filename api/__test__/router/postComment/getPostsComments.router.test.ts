import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/voxieverse/getPostsComments', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return existing posts', async () => {
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

    await request(app)
      .post('/voxieverse/createPostComment')
      .field({
        text: 'random text',
        type: 'post'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    await request(app)
      .post('/voxieverse/createPostComment')
      .field({
        text: 'random text',
        type: 'post'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    await request(app)
      .post('/voxieverse/createPostComment')
      .field({
        text: 'random text',
        post_parent_id: 1,
        type: 'comment'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const getPostsComments = await request(app)
      .get('/voxieverse/getPostsComments')
      .query({
        type_id: 1,
        type: 'post'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(getPostsComments.body).toHaveLength(2);
  });

  test('Should return existing comments in a post', async () => {
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

    await request(app)
      .post('/voxieverse/createPostComment')
      .field({
        text: 'random text',
        type: 'post'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    await request(app)
      .post('/voxieverse/createPostComment')
      .field({
        text: 'random text',
        type: 'post'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    await request(app)
      .post('/voxieverse/createPostComment')
      .field({
        text: 'random text',
        post_parent_id: 1,
        type: 'comment'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    await request(app)
      .post('/voxieverse/createPostComment')
      .field({
        text: 'random text',
        post_parent_id: 1,
        type: 'comment'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    await request(app)
      .post('/voxieverse/createPostComment')
      .field({
        text: 'random text',
        post_parent_id: 2,
        type: 'comment'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const getPostsComments = await request(app)
      .get('/voxieverse/getPostsComments')
      .query({
        type_id: 1,
        type: 'comment',
        post_parent_id: 1
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(getPostsComments.body).toHaveLength(2);
  });
});
