import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ContextWrapper, createTestRouter } from '../helper/test.helper';
import { RouterProvider } from 'react-router-dom';
import { act } from 'react';

vi.mock('../../src/utilities/request.utilities', () => ({
  request: vi.fn()
}));

describe('Navigate', () => {
  test('Should render Navigate', async () => {
    const testRouter = createTestRouter('/login');
    await act(async () => {
      render(
        <ContextWrapper>
          <RouterProvider router={testRouter} />
        </ContextWrapper>
      );
    });

    expect(screen.queryByText('Signup')).toBeInTheDocument();
  });
});
