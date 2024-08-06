import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/voxieverse/login', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return logged in user', async () => {
    await request(app)
      .post('/voxieverse/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/voxieverse/login').send({
      username: 'testUser',
      password: 'Password'
    });

    expect(login.body.user_id).toBe(1);
    expect(login.body.username).toBe('testUser');
    expect(login.headers['set-cookie'][0]).toBeDefined();
    expect(login.headers['set-cookie'][1]).toBeDefined();
  });

  test('Should return error if user doesnt exist', async () => {
    await request(app)
      .post('/voxieverse/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/voxieverse/login').send({
      username: 'testUsr',
      password: 'Password'
    });

    expect(login.body).toEqual({ error: 'Incorrect user details' });
  });

  test('Should return error if password is incorrect', async () => {
    await request(app)
      .post('/voxieverse/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/voxieverse/login').send({
      username: 'testUser',
      password: 'Passwrd'
    });

    expect(login.body).toEqual({ error: 'Incorrect user details' });
  });
});
