import { describe, expect, Mock, test, vi } from 'vitest';
import {
  ContextWrapper,
  createTestRouter,
  mockPosts,
  mockUser
} from '../helper/test.helper';
import { act } from 'react';
import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { request } from '../../src/utilities/request.utilities';
import userEvent from '@testing-library/user-event';

vi.mock('../../src/utilities/request.utilities', () => ({
  request: vi.fn()
}));

describe('Home', () => {
  test('Should render posts and navigate to post page on comment click', async () => {
    (request as Mock).mockResolvedValueOnce(mockUser);
    (request as Mock).mockResolvedValueOnce(mockPosts);
    const testRouter = createTestRouter('/');
    await act(async () => {
      render(
        <ContextWrapper>
          <RouterProvider router={testRouter} />
        </ContextWrapper>
      );
    });

    const commentButton = screen.getByLabelText('comment');

    expect(screen.getByText('Hi')).toBeInTheDocument();
    expect(commentButton).toBeInTheDocument();

    await userEvent.click(commentButton);

    expect(testRouter.state.location.pathname).toBe('/post/6');
  });
});
