import { BiSolidComment, BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { SerializedPostComment } from '../../../types/utilities/request.utilities.types';
import { Button } from '../Button.comp';
import { Navigate } from '../Navigate.comp';
import { useNavigate } from 'react-router-dom';
import { Input } from '../Input.comp';
import { FormEvent, useEffect, useState } from 'react';
import { CommentDetails } from '../../../types/comp/card/PostCard.comp.types';
import { request } from '../../utilities/request.utilities';
import { CommentCard } from './CommentCard.comp';
import { useUser } from '../../context/User.context';
import '../../style/comp/card/PostCard.comp.scss';

export const PostCard = ({
  post,
  isPostPage = false
}: {
  post: SerializedPostComment;
  isPostPage?: boolean;
}) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [page, setPage] = useState(0);
  const [isComment, setIsComment] = useState(false);
  const [currentPost, setCurrentPost] = useState<SerializedPostComment>(post);
  const [comments, setComments] = useState<SerializedPostComment[] | undefined>(
    undefined
  );
  const [commentDetails, setCommentDetails] = useState<CommentDetails>({
    text: ''
  });

  const getUpdatedPost = async () => {
    try {
      const postData = await request<unknown, SerializedPostComment>(
        `/getPostComment?&type=post&type_id=${post.id}`,
        'GET'
      );

      if (postData) {
        setCurrentPost(postData);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const getComments = async (currentPage = page, incrememtPage = true) => {
    try {
      const commentsData = await request<unknown, SerializedPostComment[]>(
        `/getPostsComments?page=${currentPage}&type=comment&post_parent_id=${post.id}`,
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

        if (incrememtPage) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const formData = new FormData();

      formData.append('text', commentDetails.text);
      formData.append('type', 'comment');
      if (currentPost?.id) {
        formData.append('post_parent_id', currentPost?.id?.toString());
      }

      await request('/createPostComment', 'POST', formData);

      setIsComment(false);
      setCommentDetails({
        text: ''
      });
      setPage(0);
      setComments(undefined);
      await getComments(0);
      await getUpdatedPost();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const likeDislike = async (reaction: string) => {
    try {
      await request('/likeDislike', 'POST', {
        user_id: user?.user_id,
        type_id: currentPost.id,
        type: 'post',
        reaction
      });

      await getUpdatedPost();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (isPostPage) {
      getComments();
    }
  }, []);

  return (
    <>
      <div className="postCard">
        {!isPostPage && <Navigate to={`/post/${post.id}`} onClick={() => {}} />}
        <header>
          <Navigate
            to={`/profile/${post.user_id}`}
            onClick={() => {}}
            SVG={<img alt="" src={currentPost?.profile_picture} />}
          />
          <div>
            {currentPost?.username} -<p>{currentPost?.created_at}</p>
          </div>
        </header>
        <main>
          {currentPost?.text}
          {currentPost?.picture && (
            <div>
              <img alt="" src={currentPost?.picture} />
              <img alt="" src={currentPost?.picture} />
            </div>
          )}
        </main>
        <footer>
          <Button
            type="button"
            onClick={async () => likeDislike('like')}
            label="like"
            className={`buttonSmall buttonOutline ${currentPost.has_liked && 'buttonPrimarySVG'}`}
            name={currentPost?.likes}
            SVG={<BiSolidLike />}
          />
          <Button
            type="button"
            onClick={async () => likeDislike('dislike')}
            label="dislike"
            className={`buttonSmall buttonOutline ${currentPost.has_disliked && 'buttonPrimarySVG'}`}
            name={currentPost?.dislikes}
            SVG={<BiSolidDislike />}
          />
          <Button
            type="button"
            onClick={async () =>
              isPostPage
                ? setIsComment(!isComment)
                : navigate(`/post/${post.id}`)
            }
            label="comment"
            className="buttonSmall buttonOutline"
            name={currentPost?.comments}
            SVG={<BiSolidComment />}
          />
        </footer>
        {isPostPage && isComment && (
          <form
            method="POST"
            onSubmit={(e) => handleSubmit(e)}
            autoComplete="off"
            noValidate
          >
            <Input<CommentDetails>
              id="text"
              type="text"
              value={commentDetails.text}
              setValue={setCommentDetails}
              placeholder="Comment..."
              isTextarea
            />
            <Button
              type="submit"
              onClick={() => {}}
              label="createComment"
              className="buttonPrimary"
              name={'Comment'}
            />
          </form>
        )}
      </div>
      {comments && (
        <>
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
          {isPostPage && (
            <Button
              type="button"
              onClick={async () => getComments()}
              label="getMore"
              className="buttonOutline"
              name="More comments"
            />
          )}
        </>
      )}
    </>
  );
};
