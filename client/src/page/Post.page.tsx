import { useEffect, useState } from 'react';
import { request } from '../utilities/request.utilities';
import { useLocation } from 'react-router-dom';
import { ReturnNav } from '../comp/ReturnNav';
import { Side, SideUser } from '../comp/Side.comp';
import { SerializedPostComment } from '../../types/utilities/request.utilities.types';
import { PostCard } from '../comp/card/PostCard.comp';
import '../style/page/Post.page.scss';

export const Post = () => {
  const location = useLocation();
  const post_id = location.pathname.split('/').pop();
  const [post, setPost] = useState<SerializedPostComment | undefined>(
    undefined
  );

  const getPost = async () => {
    try {
      const postData = await request(
        `/getPostComment?type_id=${post_id}&type=post`,
        'GET'
      );

      if (postData) {
        setPost(postData);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <ReturnNav />
      <SideUser />
      <div id="postPage">{post && <PostCard post={post} isPostPage />}</div>
      <Side />
    </>
  );
};
