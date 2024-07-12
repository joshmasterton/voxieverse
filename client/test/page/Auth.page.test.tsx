import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { ContextWrapper, createTestRouter } from '../helper/test.helper';
import { request } from '../../src/utilities/request.utilities';
import { act } from 'react';

vi.mock('../../src/utilities/request.utilities', () => ({
  request: vi.fn()
}));

describe('Login', () => {
  test('Should render correct inputs on login', async () => {
    const testRouter = createTestRouter('/');
    await act(async () => {
      render(
        <ContextWrapper>
          <RouterProvider router={testRouter} />
        </ContextWrapper>
      );
    });

    expect(screen.queryByLabelText('username')).toBeInTheDocument();
    expect(screen.queryByLabelText('email')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('password')).toBeInTheDocument();
    expect(screen.queryByLabelText('confirmPassword')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'login' })).toBeInTheDocument();
  });

  test('Should submit signup request', async () => {
    const testRouter = createTestRouter('/login');
    await act(async () => {
      render(
        <ContextWrapper>
          <RouterProvider router={testRouter} />
        </ContextWrapper>
      );
    });

    const loginButton = screen.getByRole('button', { name: 'login' });
    await userEvent.click(loginButton);

    expect(request).toHaveBeenCalledWith('/login', 'POST', {
      confirmPassword: '',
      email: '',
      password: '',
      profilePicture: undefined,
      username: ''
    });
  });
});

describe('Signup', () => {
  test('Should render correct inputs on signup', async () => {
    const testRouter = createTestRouter('/signup');
    await act(async () => {
      render(
        <ContextWrapper>
          <RouterProvider router={testRouter} />
        </ContextWrapper>
      );
    });

    expect(screen.queryByLabelText('username')).toBeInTheDocument();
    expect(screen.queryByLabelText('email')).toBeInTheDocument();
    expect(screen.queryByLabelText('password')).toBeInTheDocument();
    expect(screen.queryByLabelText('confirmPassword')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'signup' })
    ).toBeInTheDocument();
  });

  test('Should submit signup request', async () => {
    const testRouter = createTestRouter('/signup');
    await act(async () => {
      render(
        <ContextWrapper>
          <RouterProvider router={testRouter} />
        </ContextWrapper>
      );
    });

    const signupButton = screen.getByRole('button', { name: 'signup' });
    await userEvent.click(signupButton);

    expect(request).toHaveBeenCalledWith(
      '/signup',
      'POST',
      expect.any(FormData)
    );
  });
});
