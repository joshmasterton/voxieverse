import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/getPost', async () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return post with user data', async () => {
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
      .get('/getPost')
      .query({
        post_id: 1
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const likeDislikeResponse = await request(app)
      .put('/likeDislike')
      .send({
        reaction: 'like',
        type: 'post',
        type_id: response.body.post_id
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const likeDislikeResponseTwo = await request(app)
      .put('/likeDislike')
      .send({
        reaction: 'like',
        type: 'post',
        type_id: response.body.post_id
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    console.log(likeDislikeResponseTwo.body);

    expect(likeDislikeResponse.body.type).toBe('post');
    expect(likeDislikeResponse.body.type_id).toBe(1);
    expect(likeDislikeResponse.body.user_id).toBe(1);
    expect(likeDislikeResponse.body.reaction).toBe('like');
  });
});
