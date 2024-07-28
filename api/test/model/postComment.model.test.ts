import { describe, test, expect } from 'vitest';
import { PostComment } from '../../src/model/postComment.model';
import { app } from '../../src/app';
import request from 'supertest';
import path from 'path';

describe('PostComment model', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return new post on successful model create', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    await request(app).post('/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    const newPost = await new PostComment(
      undefined,
      undefined,
      undefined,
      1,
      'post',
      'random post'
    ).create();

    const getNewPost = await newPost?.get();

    if (getNewPost) {
      expect(getNewPost.id).toBe(1);
      expect(getNewPost.user_id).toBe(1);
      expect(getNewPost.text).toBe('Random post');
    }
  });

  test('Throw error if no user found', async () => {
    const newPost = await new PostComment(
      undefined,
      undefined,
      undefined,
      1,
      'post',
      'random post'
    ).create();

    if (newPost) {
      await expect(newPost.get()).rejects.toThrowError('No user found');
    }
  });
});
