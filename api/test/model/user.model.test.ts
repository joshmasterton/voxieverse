import { describe, expect, test } from 'vitest';
import { User } from '../../src/model/user.model';

describe('User model', () => {
  test('Should create a new user', async () => {
    const user = new User(
      'testUser',
      'Password',
      'test@email.com',
      'profile.jpg'
    );

    expect(user).toEqual({
      username: 'testUser',
      password: 'Password',
      email: 'test@email.com',
      profile_picture: 'profile.jpg',
      user_id: undefined,
      likes: undefined,
      dislikes: undefined,
      comments: undefined,
      friends: undefined,
      created_at: undefined,
      last_online: undefined
    });
  });

  test('Should signup user', async () => {
    const user = await new User(
      'testUser',
      'Password',
      'test@email.com',
      'profile.jpg'
    ).signup();

    expect(user?.serializeUser().user_id).toBe(1);
    expect(user?.serializeUser().username).toBe('testUser');
  });

  test('Should return error on signup if user already exists', async () => {
    await new User(
      'testUser',
      'Password',
      'test@email.com',
      'profile.jpg'
    ).signup();

    await expect(
      new User('testUser', 'Password', 'test@email.com', 'profile.jpg').signup()
    ).rejects.toThrowError('User already exists');
  });

  test('Should login user', async () => {
    await new User(
      'testUser',
      'Password',
      'test@email.com',
      'profile.jpg'
    ).signup();

    const user = await new User('testUser', 'Password').login();

    expect(user?.serializeUser().user_id).toBe(1);
    expect(user?.serializeUser().username).toBe('testUser');
  });
});
