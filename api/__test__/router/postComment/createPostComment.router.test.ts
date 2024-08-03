import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/createPostComment', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return successful post creation', async () => {
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

    const createPostComment = await request(app)
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

    expect(createPostComment.body.id).toBe(1);
    expect(createPostComment.body.post_parent_id).toBeNull();
    expect(createPostComment.body.type).toBe('post');
    expect(createPostComment.body.username).toBe('testUser');
  });

  test('Should return failure if missing type', async () => {
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

    const createPostComment = await request(app)
      .post('/createPostComment')
      .field({
        text: 'random text'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(createPostComment.body).toEqual({ error: 'type required' });
  });

  test('Should return failure if missing text', async () => {
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

    const createPostComment = await request(app)
      .post('/createPostComment')
      .field({
        type: 'post'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(createPostComment.body).toEqual({ error: 'Cannot be empty' });
  });

  test('Should return successful comment creation', async () => {
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
        type: 'post'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const createPostComment = await request(app)
      .post('/createPostComment')
      .field({
        text: 'random text',
        type: 'comment',
        post_parent_id: 1
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(createPostComment.body.id).toBe(1);
    expect(createPostComment.body.post_parent_id).toBe(1);
    expect(createPostComment.body.type).toBe('comment');
    expect(createPostComment.body.username).toBe('testUser');
  });
});
