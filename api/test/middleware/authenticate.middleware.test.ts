import { describe, expect, test } from 'vitest';
import { app } from '../../src/app';
import request from 'supertest';
import path from 'path';

describe('Authenticate', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return Voxieverse with authorized user', async () => {
    const response = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const responseAuth = await request(app)
      .get('/')
      .set('Cookie', [
        response.headers['set-cookie'][0].split(/;/)[0],
        response.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(responseAuth.body.user_id).toBe(1);
    expect(responseAuth.body.username).toBe('testUser');
  });

  test('Should generate new access token if previous one expired', async () => {
    const response = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const responseAuth = await request(app)
      .get('/')
      .set('Cookie', [response.headers['set-cookie'][1].split(/;/)[0]]);

    expect(responseAuth.body.user_id).toBe(1);
    expect(responseAuth.body.username).toBe('testUser');
  });

  test('Should return error if invalid token', async () => {
    const responseAuth = await request(app)
      .get('/')
      .set('Cookie', [`accessToken=incorrect_token`]);

    expect(responseAuth.body).toEqual({ error: 'Unauthorized' });
  });

  test('Should throw error if no tokens', async () => {
    const response = await request(app).get('/');
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });
});
