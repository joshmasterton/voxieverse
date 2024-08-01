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
import { Loading } from '../Loading.comp';
import { usePopup } from '../../context/Popup.context';
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
  const { setPopup } = usePopup();
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingDislike, setLoadingDislike] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
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
      setLoadingMore(true);

      const commentsData = await request<unknown, SerializedPostComment[]>(
        `/getPostsComments?page=${currentPage}&type=comment&post_parent_id=${post.id}`,
        'GET'
      );

      if (commentsData) {
        if (commentsData.length < 10) {
          setCanLoadMore(false);
        }

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
        setCanLoadMore(false);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoadingSubmit(true);

      const formData = new FormData();

      formData.append('text', commentDetails.text);
      formData.append('type', 'comment');
      if (currentPost?.id) {
        formData.append('post_parent_id', currentPost?.id?.toString());
      }

      const create = await request('/createPostComment', 'POST', formData);

      if (create) {
        setIsComment(false);
        setCommentDetails({
          text: ''
        });
        setPage(0);
        setComments(undefined);
        setLoading(true);
        await getComments(0);
        await getUpdatedPost();
      }
    } catch (error) {
      if (error instanceof Error) {
        setPopup(error.message);
        console.error(error.message);
      }
    } finally {
      setLoadingSubmit(false);
      setLoading(false);
    }
  };

  const likeDislike = async (reaction: string) => {
    try {
      if (reaction === 'like') {
        setLoadingLike(true);
      } else {
        setLoadingDislike(true);
      }

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
        await getUpdatedPost();
      }
    } finally {
      setLoadingLike(false);
      setLoadingDislike(false);
    }
  };

  useEffect(() => {
    if (isPostPage) {
      getComments().finally(() => {
        setLoading(false);
      });
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
          <p>{currentPost?.text}</p>
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
            loading={loadingLike}
            onClick={async () => await likeDislike('like')}
            label="like"
            className={`buttonSmall buttonOutline ${currentPost.has_liked && 'buttonPrimarySVG'}`}
            name={currentPost?.likes}
            SVG={<BiSolidLike />}
          />
          <Button
            type="button"
            loading={loadingDislike}
            onClick={async () => await likeDislike('dislike')}
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
              loading={loadingSubmit}
              onClick={() => {}}
              label="createComment"
              className="buttonPrimary"
              name={'Comment'}
            />
          </form>
        )}
      </div>
      {isPostPage && (
        <div className="commentsCon">
          {loading ? (
            <Loading />
          ) : (
            comments && (
              <>
                {comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
                {isPostPage && canLoadMore && (
                  <Button
                    type="button"
                    loading={loadingMore}
                    onClick={async () => getComments()}
                    label="getMore"
                    className="buttonOutline"
                    name="More comments"
                  />
                )}
              </>
            )
          )}
        </div>
      )}
    </>
  );
};
