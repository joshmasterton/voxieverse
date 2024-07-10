import request from 'supertest';
import { app } from '../../../src/app';
import { describe, test } from 'vitest';
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
    const response = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('profilePicture', profilePicture);
    console.log(response.body);
  });

  test('Should return error if incorrect details', async () => {
    const response = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('profilePicture', profilePicture);
    console.log(response.body);
  });
});
