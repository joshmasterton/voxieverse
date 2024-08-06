import request from 'supertest';
import { app } from '../../../src/app';
import { describe, expect, test } from 'vitest';
import path from 'path';

describe('/updateUser', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return updated user on success', async () => {
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

    const updateUser = await request(app)
      .post('/voxieverse/updateUser')
      .field({
        username: 'testUserNew',
        email: 'test@newEmail.com',
        password: 'PasswordNew',
        confirmPassword: 'PasswordNew'
      })
      .attach('file', profilePicture)
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(updateUser.body.user_id).toBe(1);
    expect(updateUser.body.username).toBe('testUserNew');
    expect(updateUser.body.email).toBe('test@newEmail.com');
  });

  test('Should return updated username on success', async () => {
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

    const updateUser = await request(app)
      .post('/voxieverse/updateUser')
      .field({
        username: 'testUserNew'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(updateUser.body.user_id).toBe(1);
    expect(updateUser.body.username).toBe('testUserNew');
  });

  test('Should return error if username taken', async () => {
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

    const updateUser = await request(app)
      .post('/voxieverse/updateUser')
      .field({
        username: 'testUser'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(updateUser.body).toEqual({ error: 'Username taken' });
  });

  test('Should return error if username taken', async () => {
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

    const updateUser = await request(app)
      .post('/voxieverse/updateUser')
      .field({
        username: 'testUser',
        password: 'Password',
        confirmPassword: 'Passwod'
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(updateUser.body).toEqual({ error: 'Passwords must match' });
  });
});
