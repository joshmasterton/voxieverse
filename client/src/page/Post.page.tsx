import { useEffect, useState } from 'react';
import { PostCard } from '../comp/PostCard.comp';
import { SerializedPost } from '../../types/page/Home.page.types';
import { request } from '../utilities/request.utilities';
import { useLocation } from 'react-router-dom';
import { ReturnNav } from '../comp/ReturnNav';
import { Side, SideUser } from '../comp/Side.comp';
import '../style/page/Post.page.scss';

export const Post = () => {
  const location = useLocation();
  const post_id = location.pathname.split('/').pop();
  const [post, setPost] = useState<SerializedPost | undefined>(undefined);

  const getPost = async () => {
    try {
      const postData = await request(`/getPost?post_id=${post_id}`, 'GET');

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
      <div id="postPage">{post && <PostCard post={post} />}</div>
      <Side />
    </>
  );
};
