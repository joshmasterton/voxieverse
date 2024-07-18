import { BiMinus, BiPlus, BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { Button } from './Button.comp';
import { MdModeComment } from 'react-icons/md';
import { SerializedComment } from '../../types/utilities/request.utilities.types';
import { Input } from './Input.comp';
import { FormEvent, useState } from 'react';
import { CommentDetails } from '../../types/comp/PostCard.comp.types';
import { request } from '../utilities/request.utilities';
import '../style/comp/CommentCard.comp.scss';

export const CommentCard = ({ comment }: { comment: SerializedComment }) => {
  const [page, setPage] = useState(0);
  const [isComment, setIsComment] = useState(false);
  const [replies, setReplies] = useState<SerializedComment[] | undefined>(
    undefined
  );
  const [commentDetails, setCommentDetails] = useState({
    comment: ''
  });

  const lessReplies = () => {
    setReplies(undefined);
    setPage(0);
  };

  const getReplies = async (currentPage = 0, incrememtPage = false) => {
    try {
      const repliesData = await request<unknown, SerializedComment[]>(
        `/getComments?page=${currentPage}&post_id=${comment.post_id}&comment_parent_id=${comment.comment_id}`,
        'GET'
      );

      if (repliesData) {
        setReplies((prevReplies) => {
          if (prevReplies && repliesData.length > 0) {
            return [...prevReplies, ...repliesData];
          }

          if (repliesData.length > 0) {
            return repliesData;
          }

          if (prevReplies) {
            return prevReplies;
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

      await request('/createComment', 'POST', {
        comment: commentDetails.comment,
        post_id: comment.post_id,
        comment_parent_id: comment.comment_id
      });

      setIsComment(false);
      setPage(0);
      setCommentDetails({
        comment: ''
      });

      await getReplies(page);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <div className="commentCard">
      <header>
        <div />
      </header>
      <div className="commentCardChild">
        <header>
          <img alt="" src={comment?.profile_picture} />
          <div>
            <div>{comment?.username}</div>
            <p>{comment?.created_at}</p>
          </div>
        </header>
        <main>
          <div>{comment?.comment}</div>
        </main>
        <footer>
          {replies && replies.length > 0 && (
            <Button
              type="button"
              onClick={() => lessReplies()}
              label="less"
              className="buttonLess buttonName buttonOutline buttonSmall"
              SVG={<BiMinus />}
            />
          )}
          <Button
            type="button"
            onClick={() => {}}
            label="like"
            className="buttonName buttonOutline buttonSmall"
            name={comment?.likes}
            SVG={<BiSolidLike />}
          />
          <Button
            type="button"
            onClick={() => {}}
            label="dislike"
            className="buttonName buttonOutline buttonSmall"
            name={comment?.dislikes}
            SVG={<BiSolidDislike />}
          />
          <Button
            type="button"
            onClick={() => setIsComment(!isComment)}
            label="comment"
            className="buttonName buttonOutline buttonSmall"
            name={comment?.comments}
            SVG={<MdModeComment />}
          />
          <Button
            type="button"
            onClick={async () => await getReplies(page, true)}
            label="more"
            className="buttonName buttonOutline buttonSmall"
            SVG={<BiPlus />}
          />
        </footer>
        {isComment && (
          <form
            method="POST"
            onSubmit={(e) => handleSubmit(e)}
            autoComplete="off"
            noValidate
          >
            <Input<CommentDetails>
              id="comment"
              type="text"
              value={commentDetails.comment}
              setValue={setCommentDetails}
              placeholder="Reply..."
              isTextarea
            />
            <Button
              type="submit"
              onClick={() => {}}
              label="createComment"
              className="buttonPrimary"
              name="Send"
            />
          </form>
        )}
        {replies &&
          replies.length > 0 &&
          replies.map((reply) => (
            <CommentCard key={reply.comment_id} comment={reply} />
          ))}
      </div>
    </div>
  );
};
