import { describe, expect, test } from 'vitest';
import { app } from '../../../src/app';
import request from 'supertest';
import path from 'path';

describe('/addFriend', () => {
  const profilePicture = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'voxieverse_test.png'
  );

  test('Should return new friendship on success', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    await request(app)
      .post('/signup')
      .field({
        username: 'testUserTwo',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    const addFriend = await request(app)
      .post('/addFriend')
      .send({
        friend_id: 2
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(addFriend.body.id).toBe(1);
    expect(addFriend.body.friend_one_id).toBe(1);
    expect(addFriend.body.friend_initiator_id).toBe(1);
    expect(addFriend.body.friend_two_id).toBe(2);
    expect(addFriend.body.friend_accepted).toBeFalsy();
  });

  test('Should return updated friendship if friend_two accepts', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const signupTwo = await request(app)
      .post('/signup')
      .field({
        username: 'testUserTwo',
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
      .post('/addFriend')
      .send({
        friend_id: 2
      })
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    const loginTwo = await request(app).post('/login').send({
      username: signupTwo.body.username,
      password: 'Password'
    });

    const addFriend = await request(app)
      .post('/addFriend')
      .send({
        friend_id: 1
      })
      .set('Cookie', [
        loginTwo.headers['set-cookie'][0].split(/;/)[0],
        loginTwo.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(addFriend.body.id).toBe(1);
    expect(addFriend.body.friend_one_id).toBe(1);
    expect(addFriend.body.friend_initiator_id).toBe(1);
    expect(addFriend.body.friend_two_id).toBe(2);
    expect(addFriend.body.friend_accepted).toBeTruthy();
  });

  test('Should throw error in no friend_id provided', async () => {
    const signup = await request(app)
      .post('/signup')
      .field({
        username: 'testUser',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    await request(app)
      .post('/signup')
      .field({
        username: 'testUserTwo',
        email: 'test@email.com',
        password: 'Password',
        confirmPassword: 'Password'
      })
      .attach('file', profilePicture);

    const login = await request(app).post('/login').send({
      username: signup.body.username,
      password: 'Password'
    });

    const addFriend = await request(app)
      .post('/addFriend')
      .send({})
      .set('Cookie', [
        login.headers['set-cookie'][0].split(/;/)[0],
        login.headers['set-cookie'][1].split(/;/)[0]
      ]);

    expect(addFriend.body).toEqual({ error: 'friend_id required' });
  });
});
