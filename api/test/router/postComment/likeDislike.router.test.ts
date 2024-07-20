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

  test('Should return post with a like', async () => {
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

    expect(likeDislikeResponse.body.post_id).toBe(1);
    expect(likeDislikeResponse.body.likes).toBe(1);
  });

  test('Should return comment with a like', async () => {
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

    const response = await request(app)
      .get('/getComment')
      .query({
        comment_id: 1
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const likeDislikeResponse = await request(app)
      .put('/likeDislike')
      .send({
        reaction: 'like',
        type: 'comment',
        type_id: response.body.comment_id
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(likeDislikeResponse.body.comment_id).toBe(1);
    expect(likeDislikeResponse.body.likes).toBe(1);
  });

  test('Should return comment with no like or dislike if liked twice', async () => {
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

    const response = await request(app)
      .get('/getComment')
      .query({
        comment_id: 1
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    await request(app)
      .put('/likeDislike')
      .send({
        reaction: 'like',
        type: 'comment',
        type_id: response.body.comment_id
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const likeDislikeResponse = await request(app)
      .put('/likeDislike')
      .send({
        reaction: 'like',
        type: 'comment',
        type_id: response.body.comment_id
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(likeDislikeResponse.body.comment_id).toBe(1);
    expect(likeDislikeResponse.body.likes).toBe(0);
    expect(likeDislikeResponse.body.dislikes).toBe(0);
  });

  test('Should return comment with dislike if liked previously', async () => {
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

    const response = await request(app)
      .get('/getComment')
      .query({
        comment_id: 1
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    await request(app)
      .put('/likeDislike')
      .send({
        reaction: 'like',
        type: 'comment',
        type_id: response.body.comment_id
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const likeDislikeResponse = await request(app)
      .put('/likeDislike')
      .send({
        reaction: 'dislike',
        type: 'comment',
        type_id: response.body.comment_id
      })
      .set('Cookie', [
        responseLogin.headers['set-cookie'][0].split(/;/)[0],
        responseLogin.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(likeDislikeResponse.body.comment_id).toBe(1);
    expect(likeDislikeResponse.body.likes).toBe(0);
    expect(likeDislikeResponse.body.dislikes).toBe(1);
  });
});
