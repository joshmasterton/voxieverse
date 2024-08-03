import request from 'supertest';
import { app } from '../../../src/app';
import { describe, expect, test } from 'vitest';
import path from 'path';

describe('/signup', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return user upon successful signup', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    expect(signup.body.user_id).toBe(1);
    expect(signup.body.username).toBe('testUser');
    expect(signup.headers['set-cookie'][0]).toBeDefined();
    expect(signup.headers['set-cookie'][1]).toBeDefined();
  });

  test('Should return error if no username', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    expect(signup.body).toEqual({ error: 'Username required' });
  });

  test('Should return error if no email', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    expect(signup.body).toEqual({ error: 'Email required' });
  });

  test('Should return error if no password', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    expect(signup.body).toEqual({ error: 'Password required' });
  });

  test('Should return error if no confirm password', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password'
      })
      .attach('file', profilePicture);

    expect(signup.body).toEqual({ error: 'Confirm password required' });
  });

  test('Should return error if no profile picture', async () => {
    const signup = await request(app).post('/signup').field({
      username: 'testUser',
      email: 'test@email.com',
      password: 'Password',
      confirmPassword: 'Password'
    });

    expect(signup.body).toEqual({ error: 'Profile picture required' });
  });
});
