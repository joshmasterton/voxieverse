import {
  BiMinus,
  BiPlus,
  BiSolidComment,
  BiSolidDislike,
  BiSolidLike
} from 'react-icons/bi';
import { SerializedPostComment } from '../../../types/utilities/request.utilities.types';
import { Button } from '../Button.comp';
import { Input } from '../Input.comp';
import { FormEvent, useState } from 'react';
import { CommentDetails } from '../../../types/comp/card/PostCard.comp.types';
import { request } from '../../utilities/request.utilities';
import { useUser } from '../../context/User.context';
import { Navigate } from '../Navigate.comp';
import { Loading } from '../Loading.comp';
import { usePopup } from '../../context/Popup.context';
import '../../style/comp/card/CommentCard.comp.scss';

export const CommentCard = ({
  comment
}: {
  comment: SerializedPostComment;
}) => {
  const { user } = useUser();
  const { setPopup } = usePopup();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingDislike, setLoadingDislike] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [page, setPage] = useState(0);
  const [isReply, setIsReply] = useState(false);
  const [currentComment, setCurrentComment] =
    useState<SerializedPostComment>(comment);
  const [comments, setReplies] = useState<SerializedPostComment[] | undefined>(
    undefined
  );
  const [commentDetails, setCommentDetails] = useState<CommentDetails>({
    text: ''
  });

  const getUpdatedParentComment = async () => {
    try {
      const commentData = await request<unknown, SerializedPostComment>(
        `/getPostComment?&type=comment&type_id=${comment.id}`,
        'GET'
      );

      if (commentData) {
        setCurrentComment(commentData);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const getReplies = async (currentPage = page, incrememtPage = true) => {
    try {
      setLoadingMore(true);

      const commentsData = await request<unknown, SerializedPostComment[]>(
        `/getPostsComments?page=${currentPage}&type=comment&post_parent_id=${comment.post_parent_id}&comment_parent_id=${comment.id}`,
        'GET'
      );

      if (commentsData) {
        setReplies((prevComments) => {
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
    } finally {
      setLoadingMore(false);
    }
  };

  const lessReplies = () => {
    setReplies(undefined);
    setPage(0);
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoadingSubmit(true);

      const formData = new FormData();

      formData.append('text', commentDetails.text);
      formData.append('type', 'comment');
      if (currentComment?.post_parent_id) {
        formData.append(
          'post_parent_id',
          currentComment?.post_parent_id?.toString()
        );
      }

      if (currentComment?.id) {
        formData.append('comment_parent_id', currentComment?.id?.toString());
      }

      const reply = await request('/createPostComment', 'POST', formData);

      if (reply) {
        setIsReply(false);
        setCommentDetails({
          text: ''
        });
        setPage(0);
        setReplies(undefined);
        setLoading(true);
        await getReplies(0);
        await getUpdatedParentComment();
      }
    } catch (error) {
      if (error instanceof Error) {
        setPopup(error.message);
        console.error(error.message);
      }
    } finally {
      setLoading(false);
      setLoadingSubmit(false);
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
        type_id: currentComment.id,
        type: 'comment',
        reaction
      });

      await getUpdatedParentComment();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoadingLike(false);
      setLoadingDislike(false);
    }
  };

  return (
    <>
      <div className="commentCard">
        <header>
          <Button
            type="button"
            onClick={() => lessReplies()}
            label="lessReplies"
            className="buttonOutline"
            SVG={<BiMinus />}
          />
          <Navigate
            to={`/profile/${currentComment.user_id}`}
            onClick={() => {}}
            SVG={<img alt="" src={currentComment?.profile_picture} />}
          />
          <p />
          {!loading && (
            <Button
              type="button"
              loading={loadingMore}
              onClick={async () => await getReplies()}
              label="getMore"
              className="buttonOutline"
              SVG={<BiPlus />}
            />
          )}
        </header>
        <div>
          <header>
            <div>
              {currentComment?.username} -<p>{currentComment?.created_at}</p>
            </div>
          </header>
          <main>
            {currentComment?.text}
            {currentComment?.picture && (
              <div>
                <img alt="" src={currentComment?.picture} />
                <img alt="" src={currentComment?.picture} />
              </div>
            )}
          </main>
          <footer>
            <Button
              type="button"
              loading={loadingLike}
              onClick={async () => likeDislike('like')}
              label="like"
              className={`buttonSmall buttonOutline ${currentComment.has_liked && 'buttonPrimarySVG'}`}
              name={currentComment?.likes}
              SVG={<BiSolidLike />}
            />
            <Button
              type="button"
              loading={loadingDislike}
              onClick={async () => likeDislike('dislike')}
              label="dislike"
              className={`buttonSmall buttonOutline ${currentComment.has_disliked && 'buttonPrimarySVG'}`}
              name={currentComment?.dislikes}
              SVG={<BiSolidDislike />}
            />
            <Button
              type="button"
              onClick={() => setIsReply(!isReply)}
              label="comment"
              className="buttonSmall buttonOutline"
              name={currentComment?.comments}
              SVG={<BiSolidComment />}
            />
          </footer>
          {isReply && (
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
                placeholder="Reply..."
                isTextarea
              />
              <Button
                type="submit"
                loading={loadingSubmit}
                onClick={() => {}}
                label="createComment"
                className="buttonPrimary"
                name={'Reply'}
              />
            </form>
          )}
          {loading ? (
            <Loading />
          ) : (
            comments &&
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </>
  );
};
