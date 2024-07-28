import { describe, test, expect } from 'vitest';
import { LikeDislike } from '../../src/model/likeDislike.model';
import { PostComment } from '../../src/model/postComment.model';
import { app } from '../../src/app';
import request from 'supertest';
import path from 'path';

describe('LikeDislike model', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return error if no post', async () => {
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

    await expect(
      new LikeDislike(1, 1, 'comment', 'like').create()
    ).rejects.toThrowError('No comment found');
  });

  test('Should return new like or dislike on post or comment', async () => {
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

    const newComment = await new PostComment(
      undefined,
      undefined,
      undefined,
      1,
      'comment',
      'Random comment'
    ).create();

    if (newComment) {
      const newLikeDislike = await new LikeDislike(
        1,
        1,
        'comment',
        'like'
      ).create();

      const getNewLikeDislike = await newLikeDislike?.get();

      expect(getNewLikeDislike?.type_id).toBe(1);
      expect(getNewLikeDislike?.user_id).toBe(1);
      expect(getNewLikeDislike?.type).toBe('comment');
      expect(getNewLikeDislike?.reaction).toBe('like');
    }
  });
});
