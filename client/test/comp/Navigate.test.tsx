import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { createTestRouter } from '../testHelpers';
import { RouterProvider } from 'react-router-dom';

describe('Navigate', () => {
  test('Should render Navigate', () => {
    const testRouter = createTestRouter('/login');
    render(<RouterProvider router={testRouter} />);
    expect(screen.queryByText('Signup')).toBeInTheDocument();
  });
});
