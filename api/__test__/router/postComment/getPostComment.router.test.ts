import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/voxieverse/getPostComment', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return existing post with user details and liked info', async () => {
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
      .post('/voxieverse/likeDislike')
      .send({
        type: 'post',
        type_id: 1,
        reaction: 'like'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const getPostComment = await request(app)
      .get('/voxieverse/getPostComment')
      .query({
        type_id: 1,
        type: 'post'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(getPostComment.body.id).toBe(1);
    expect(getPostComment.body.post_parent_id).toBeNull();
    expect(getPostComment.body.type).toBe('post');
    expect(getPostComment.body.username).toBe('testUser');
    expect(getPostComment.body.has_liked).toBeTruthy();
  });
});
