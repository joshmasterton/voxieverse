import { Dispatch, SetStateAction } from 'react';
import { SerializedPostComment } from '../../types/utilities/request.utilities.types';
import { request } from './request.utilities';

export const getPosts = async (
  currentPage = 0,
  incrememtPage = true,
  setPosts: Dispatch<SetStateAction<SerializedPostComment[] | undefined>>,
  setCanLoadMore: Dispatch<SetStateAction<boolean>>,
  setPage: Dispatch<SetStateAction<number>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  user_id?: number
) => {
  try {
    setLoading(true);

    const postsData = await request<unknown, SerializedPostComment[]>(
      `/getPostsComments?page=${currentPage}&type=post${user_id ? `&profile_id=${user_id}` : ''}`,
      'GET'
    );

    if (postsData) {
      if (postsData.length < 10) {
        setCanLoadMore(false);
      }

      setPosts((prevPosts) => {
        if (prevPosts && postsData.length > 0) {
          return [...prevPosts, ...postsData];
        }

        if (postsData.length > 0) {
          return postsData;
        }

        if (prevPosts) {
          return prevPosts;
        }

        return undefined;
      });

      if (incrememtPage) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      setCanLoadMore(false);
    }
  } finally {
    setLoading(false);
  }
};
