import { BiSolidComment, BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { SerializedPostComment } from '../../../types/utilities/request.utilities.types';
import { Button } from '../Button.comp';
import { Input } from '../Input.comp';
import { FormEvent, useEffect, useState } from 'react';
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
  const [comments, setComments] = useState<SerializedPostComment[] | undefined>(
    undefined
  );
  const [commentDetails, setCommentDetails] = useState<CommentDetails>({
    text: ''
  });

  const getReplies = async (currentPage = page, incrememtPage = false) => {
    try {
      const commentsData = await request<unknown, SerializedPostComment[]>(
        `/getPostsComments?page=${currentPage}&type=comment&post_parent_id=${comment.post_parent_id}&comment_parent_id=${comment.id}`,
        'GET'
      );

      if (commentsData) {
        console.log(commentsData);
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

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const formData = new FormData();

      formData.append('text', commentDetails.text);
      formData.append('type', 'comment');
      if (comment?.post_parent_id) {
        formData.append('post_parent_id', comment?.post_parent_id?.toString());
      }

      if (comment?.id) {
        formData.append('comment_parent_id', comment?.id?.toString());
      }

      const reply = await request('/createPostComment', 'POST', formData);
      console.log(reply);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getReplies();
  }, []);

  return (
    <>
      <div className="commentCard">
        <header>
          <img alt="" src={comment?.profile_picture} />
          <div>
            {comment?.username}
            <p>{comment?.created_at}</p>
          </div>
        </header>
        <main>
          {comment?.text}
          {comment?.picture && (
            <div>
              <img alt="" src={comment?.picture} />
              <img alt="" src={comment?.picture} />
            </div>
          )}
        </main>
        <footer>
          <Button
            type="button"
            onClick={() => {}}
            label="like"
            className="buttonSmall buttonOutline"
            name={comment?.likes}
            SVG={<BiSolidLike />}
          />
          <Button
            type="button"
            onClick={() => {}}
            label="dislike"
            className="buttonSmall buttonOutline"
            name={comment?.likes}
            SVG={<BiSolidDislike />}
          />
          <Button
            type="button"
            onClick={() => setIsReply(!isReply)}
            label="comment"
            className="buttonSmall buttonOutline"
            name={comment?.likes}
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
              placeholder="How are you today?"
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
        {comments &&
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
      </div>
    </>
  );
};
