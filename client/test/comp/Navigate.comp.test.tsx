import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { ContextWrapper, createTestRouter } from '../helper/test.helper';
import { RouterProvider } from 'react-router-dom';

describe('Navigate', () => {
  test('Should render Navigate', () => {
    const testRouter = createTestRouter('/login');
    render(
      <ContextWrapper>
        <RouterProvider router={testRouter} />
      </ContextWrapper>
    );
    expect(screen.queryByText('Signup')).toBeInTheDocument();
  });
});
