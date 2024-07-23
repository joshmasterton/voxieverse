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
import '../../style/comp/card/CommentCard.comp.scss';

export const CommentCard = ({
  comment
}: {
  comment: SerializedPostComment;
}) => {
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
    }
  };

  const lessReplies = () => {
    setReplies(undefined);
    setPage(0);
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
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

      await request('/createPostComment', 'POST', formData);

      setIsReply(false);
      setCommentDetails({
        text: ''
      });
      setPage(0);
      setReplies(undefined);
      await getReplies(0);
      await getUpdatedParentComment();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="commentCard">
        <header>
          {comments && comments?.length > 0 && (
            <Button
              type="button"
              onClick={() => lessReplies()}
              label="like"
              className="buttonOutline"
              SVG={<BiMinus />}
            />
          )}
          <img alt="" src={currentComment?.profile_picture} />
          <p />
          <Button
            type="button"
            onClick={async () => await getReplies()}
            label="like"
            className="buttonOutline"
            SVG={<BiPlus />}
          />
        </header>
        <div>
          <header>
            <div>
              {currentComment?.username}
              <p>{currentComment?.created_at}</p>
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
              onClick={() => {}}
              label="like"
              className="buttonSmall buttonOutline"
              name={currentComment?.likes}
              SVG={<BiSolidLike />}
            />
            <Button
              type="button"
              onClick={() => {}}
              label="dislike"
              className="buttonSmall buttonOutline"
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
                onClick={() => {}}
                label="createComment"
                className="buttonPrimary"
                name={'Reply'}
              />
            </form>
          )}
          {comments &&
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
        </div>
      </div>
    </>
  );
};
