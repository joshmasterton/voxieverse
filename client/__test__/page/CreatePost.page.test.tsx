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

describe('CreatePost', () => {
  test('Should render CreatePost page', async () => {
    (request as Mock).mockResolvedValueOnce(mockUser);
    (request as Mock).mockResolvedValueOnce(mockPosts);
    const testRouter = createTestRouter('/new');
    await act(async () => {
      render(
        <ContextWrapper>
          <RouterProvider router={testRouter} />
        </ContextWrapper>
      );
    });

    const createPostButton = screen.getByLabelText('createPost');

    expect(createPostButton).toBeInTheDocument();

    await userEvent.click(createPostButton);

    expect(request).toHaveBeenCalledWith(
      '/createPostComment',
      'POST',
      expect.any(FormData)
    );
  });
});
