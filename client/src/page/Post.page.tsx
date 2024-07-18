import { useEffect, useState } from 'react';
import { PostCard } from '../comp/PostCard.comp';
import { SerializedPost } from '../../types/utilities/request.utilities.types';
import { request } from '../utilities/request.utilities';
import { useLocation } from 'react-router-dom';
import { ReturnNav } from '../comp/ReturnNav';
import { Side, SideUser } from '../comp/Side.comp';
import { SerializedComment } from '../../types/utilities/request.utilities.types';
import { CommentCard } from '../comp/CommentCard.comp';
import { Button } from '../comp/Button.comp';
import '../style/page/Post.page.scss';

export const Post = () => {
  const location = useLocation();
  const post_id = location.pathname.split('/').pop();
  const [page, setPage] = useState(0);
  const [post, setPost] = useState<SerializedPost | undefined>(undefined);
  const [comments, setComments] = useState<SerializedComment[] | undefined>(
    undefined
  );

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

  const getComments = async (currentPage = 0, incrememtPage = false) => {
    try {
      const commentsData = await request<unknown, SerializedComment[]>(
        `/getComments?page=${currentPage}&post_id=${post_id}`,
        'GET'
      );

      if (commentsData) {
        setComments((prevComments) => {
          if (prevComments && commentsData.length > 0) {
            return [...prevComments, ...commentsData];
          }

          if (commentsData.length > 0) {
            return commentsData;
          }

          if (prevComments) {
            return prevComments;
          }

          return undefined;
        });
      }

      if (incrememtPage) {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getPost().then(() => getComments(page));
  }, []);

  return (
    <>
      <ReturnNav />
      <SideUser />
      <div id="postPage">
        {post && (
          <>
            <PostCard post={post} isPostPage />
            {comments &&
              comments.length > 0 &&
              comments.map((comment) => (
                <CommentCard key={comment.comment_id} comment={comment} />
              ))}
            {comments && comments.length === 10 && (
              <Button
                type="button"
                onClick={async () => await getComments(page + 1, true)}
                label="moreComments"
                className="buttonOutline"
                name="More comments"
              />
            )}
          </>
        )}
      </div>
      <Side />
    </>
  );
};
