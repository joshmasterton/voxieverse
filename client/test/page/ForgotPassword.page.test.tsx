import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { ContextWrapper, createTestRouter } from '../helper/test.helper';

describe('Forgot password', () => {
  test('Should render correct inputs on Forgot password', () => {
    const testRouter = createTestRouter('/forgotPassword');
    render(
      <ContextWrapper>
        <RouterProvider router={testRouter} />
      </ContextWrapper>
    );

    expect(screen.queryByLabelText('token')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('email')).toBeInTheDocument();
    expect(screen.queryByLabelText('password')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('confirmPassword')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'sendEmail' }));
  });
});

describe('Forgot password', () => {
  test('Should render correct inputs on Reset password', () => {
    const testRouter = createTestRouter('/resetPassword');
    render(
      <ContextWrapper>
        <RouterProvider router={testRouter} />
      </ContextWrapper>
    );

    expect(screen.queryByLabelText('token')).toBeInTheDocument();
    expect(screen.queryByLabelText('email')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('password')).toBeInTheDocument();
    expect(screen.queryByLabelText('confirmPassword')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'resetPassword' }));
  });
});
