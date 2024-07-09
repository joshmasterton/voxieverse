import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { createTestRouter } from '../testHelpers';

describe('Login', () => {
  test('Should render correct inputs', () => {
    const testRouter = createTestRouter('/');
    render(<RouterProvider router={testRouter} />);
    expect(screen.queryByLabelText('username')).toBeInTheDocument();
    expect(screen.queryByLabelText('email')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('password')).toBeInTheDocument();
    expect(screen.queryByLabelText('confirmPassword')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'login' }));
  });
});

describe('Signup', () => {
  test('Should render correct inputs', () => {
    const testRouter = createTestRouter('/signup');
    render(<RouterProvider router={testRouter} />);
    expect(screen.queryByLabelText('username')).toBeInTheDocument();
    expect(screen.queryByLabelText('email')).toBeInTheDocument();
    expect(screen.queryByLabelText('password')).toBeInTheDocument();
    expect(screen.queryByLabelText('confirmPassword')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'signup' }));
  });
});
