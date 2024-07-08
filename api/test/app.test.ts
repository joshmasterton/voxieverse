import { describe, expect, test } from 'vitest';
import { app } from '../src/app';
import request from 'supertest';

describe('/', () => {
  test('Should return Voxieverse', async () => {
    const response = await request(app).get('/');
    expect(response.body).toEqual({ message: 'Voxieverse' });
  });
});
