import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { ContextWrapper, createTestRouter } from '../helper/test.helper';
import { act } from 'react';

vi.mock('../../src/utilities/request.utilities', () => ({
  request: vi.fn()
}));

describe('Forgot password', () => {
  test('Should render correct inputs on Forgot password', async () => {
    const testRouter = createTestRouter('/forgotPassword');
    await act(async () => {
      render(
        <ContextWrapper>
          <RouterProvider router={testRouter} />
        </ContextWrapper>
      );
    });

    expect(screen.queryByLabelText('token')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('email')).toBeInTheDocument();
    expect(screen.queryByLabelText('password')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('confirmPassword')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'sendEmail' }));
  });
});

describe('Forgot password', () => {
  test('Should render correct inputs on Reset password', async () => {
    const testRouter = createTestRouter('/resetPassword');
    await act(async () => {
      render(
        <ContextWrapper>
          <RouterProvider router={testRouter} />
        </ContextWrapper>
      );
    });

    expect(screen.queryByLabelText('token')).toBeInTheDocument();
    expect(screen.queryByLabelText('email')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('newPassword')).toBeInTheDocument();
    expect(screen.queryByLabelText('newConfirmPassword')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'resetPassword' }));
  });
});
