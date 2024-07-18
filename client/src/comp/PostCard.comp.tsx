import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { Button } from './Button.comp';
import { MdModeComment } from 'react-icons/md';
import { SerializedPost } from '../../types/utilities/request.utilities.types';
import { Navigate } from './Navigate.comp';
import { Input } from './Input.comp';
import { FormEvent, useState } from 'react';
import { CommentDetails } from '../../types/comp/PostCard.comp.types';
import { request } from '../utilities/request.utilities';
import '../style/comp/PostCard.comp.scss';

export const PostCard = ({
  post,
  isPostPage = false
}: {
  post: SerializedPost;
  isPostPage?: boolean;
}) => {
  const [isComment, setIsComment] = useState(false);
  const [commentDetails, setCommentDetails] = useState({
    comment: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      await request('/createComment', 'POST', {
        comment: commentDetails.comment,
        post_id: post.post_id
      });

      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <div className="postCard">
      {!isPostPage && (
        <Navigate to={`/post/${post.post_id}`} onClick={() => {}} />
      )}
      <header>
        <img alt="" src={post?.profile_picture} />
        <div>
          <div>{post?.username}</div>
          <p>{post?.created_at}</p>
        </div>
      </header>
      <main>
        <div>{post?.post}</div>
        {post?.post_picture && (
          <div className="imgCon">
            <img alt="" className="imgPost" src={post?.post_picture} />
            <img alt="" className="imgPost" src={post?.post_picture} />
          </div>
        )}
      </main>
      <footer>
        <Button
          type="button"
          onClick={() => {}}
          label="like"
          className="buttonName buttonOutline buttonSmall"
          name={post?.likes}
          SVG={<BiSolidLike />}
        />
        <Button
          type="button"
          onClick={() => {}}
          label="dislike"
          className="buttonName buttonOutline buttonSmall"
          name={post?.dislikes}
          SVG={<BiSolidDislike />}
        />
        <Button
          type="button"
          onClick={() => setIsComment(!isComment)}
          label="comment"
          className="buttonName buttonOutline buttonSmall"
          name={post?.comments}
          SVG={<MdModeComment />}
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
            id="comment"
            type="text"
            value={commentDetails.comment}
            setValue={setCommentDetails}
            placeholder="Comment..."
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
    </div>
  );
};
