import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/removeFriend', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return success on removed friendship', async () => {
    const signup = await request(app)
      .post('/voxieverse/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    await request(app)
      .post('/voxieverse/signup')
      .field({
        username: 'testUserTwo',
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
      .post('/voxieverse/addFriend')
      .send({
        friend_id: 2
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const removeFriend = await request(app)
      .delete('/voxieverse/removeFriend')
      .send({
        friend_id: 2
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(removeFriend.body).toBe('Friend removed');
  });
});
