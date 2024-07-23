import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/createLikeDislike', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return successful like on post', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    await request(app)
      .post('/createPostComment')
      .field({
        text: 'random text',
        type: 'post'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const likeDislike = await request(app)
      .post('/likeDislike')
      .send({
        type: 'post',
        type_id: 1,
        reaction: 'like'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(likeDislike.body.type_id).toBe(1);
    expect(likeDislike.body.user_id).toBe(1);
    expect(likeDislike.body.reaction).toBe('like');
  });

  test('Should return remove like if liked already', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    await request(app)
      .post('/createPostComment')
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
      .post('/likeDislike')
      .send({
        type: 'post',
        type_id: 1,
        reaction: 'like'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const likeDislike = await request(app)
      .post('/likeDislike')
      .send({
        type: 'post',
        type_id: 1,
        reaction: 'like'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(likeDislike.body.type_id).toBeUndefined();
  });

  test('Should return dislike if liked already', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    await request(app)
      .post('/createPostComment')
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
      .post('/likeDislike')
      .send({
        type: 'post',
        type_id: 1,
        reaction: 'like'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const likeDislike = await request(app)
      .post('/likeDislike')
      .send({
        type: 'post',
        type_id: 1,
        reaction: 'dislike'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(likeDislike.body.type_id).toBe(1);
    expect(likeDislike.body.user_id).toBe(1);
    expect(likeDislike.body.reaction).toBe('dislike');
  });
});
