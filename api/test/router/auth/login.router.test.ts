import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/login', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return logged in user', async () => {
    await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const response = await request(app).post('/login').send({
      username: 'testUser',
      password: 'Password'
    });

    expect(response.body.user_id).toBe(1);
    expect(response.body.username).toBe('testUser');
    expect(response.headers['set-cookie'][0]).toBeDefined();
    expect(response.headers['set-cookie'][1]).toBeDefined();
  });

  test('Should return error if user doesnt exist', async () => {
    await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const response = await request(app).post('/login').send({
      username: 'testUsr',
      password: 'Password'
    });

    expect(response.body).toEqual({ error: 'Incorrect user details' });
  });

  test('Should return error if password is incorrect', async () => {
    await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const response = await request(app).post('/login').send({
      username: 'testUser',
      password: 'Passwrd'
    });

    expect(response.body).toEqual({ error: 'Incorrect user details' });
  });
});
