import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { Button } from './Button.comp';
import { MdModeComment } from 'react-icons/md';
import { SerializedPost } from '../../types/utilities/request.utilities.types';
import { Navigate } from './Navigate.comp';
import { Input } from './Input.comp';
import { FormEvent, useEffect, useState } from 'react';
import { SerializedComment } from '../../types/utilities/request.utilities.types';
import { CommentDetails } from '../../types/comp/PostCard.comp.types';
import { request } from '../utilities/request.utilities';
import { CommentCard } from './CommentCard.comp';
import { useNavigate } from 'react-router-dom';
import '../style/comp/PostCard.comp.scss';

export const PostCard = ({
  post,
  isPostPage = false
}: {
  post: SerializedPost;
  isPostPage?: boolean;
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [currentPost, setCurrentPost] = useState(post);
  const [isComment, setIsComment] = useState(false);
  const [comments, setComments] = useState<SerializedComment[] | undefined>(
    undefined
  );
  const [commentDetails, setCommentDetails] = useState({
    comment: ''
  });

  const handleLikeDislike = async (
    type: string,
    type_id: number | undefined,
    reaction: string
  ) => {
    try {
      const likedDislikedPost = await request<unknown, SerializedPost>(
        '/likeDislike',
        'PUT',
        {
          type,
          type_id,
          reaction
        }
      );

      if (likedDislikedPost) {
        setCurrentPost(likedDislikedPost);
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

      const updatedPost = await request<unknown, SerializedPost>(
        '/createComment',
        'POST',
        {
          comment: commentDetails.comment,
          post_id: post.post_id
        }
      );

      if (updatedPost) {
        setCurrentPost(updatedPost);
      }

      setComments(undefined);
      setCommentDetails({ comment: '' });
      setIsComment(false);
      setPage(0);

      await getComments();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const getComments = async (currentPage = 0, incrememtPage = false) => {
    try {
      const commentsData = await request<unknown, SerializedComment[]>(
        `/getComments?page=${currentPage}&post_id=${post.post_id}`,
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
    if (isPostPage) {
      getComments();
    }
  }, []);

  return (
    <>
      <div className="postCard">
        {!isPostPage && (
          <Navigate to={`/post/${post.post_id}`} onClick={() => {}} />
        )}
        <header>
          <img alt="" src={currentPost?.profile_picture} />
          <div>
            <div>{currentPost?.username}</div>
            <p>{currentPost?.created_at}</p>
          </div>
        </header>
        <main>
          <div>{currentPost?.post}</div>
          {currentPost?.post_picture && (
            <div className="imgCon">
              <img alt="" className="imgPost" src={currentPost?.post_picture} />
              <img alt="" className="imgPost" src={currentPost?.post_picture} />
            </div>
          )}
        </main>
        <footer>
          <Button
            type="button"
            onClick={async () =>
              handleLikeDislike('post', post.post_id, 'like')
            }
            label="like"
            className={`buttonName buttonOutline buttonSmall ${currentPost.hasLiked && 'buttonPrimary'}`}
            name={currentPost?.likes}
            SVG={<BiSolidLike />}
          />
          <Button
            type="button"
            onClick={async () =>
              handleLikeDislike('post', post.post_id, 'dislike')
            }
            label="dislike"
            className={`buttonName buttonOutline buttonSmall ${currentPost.hasDisliked && 'buttonPrimary'}`}
            name={currentPost?.dislikes}
            SVG={<BiSolidDislike />}
          />
          <Button
            type="button"
            onClick={() =>
              isPostPage
                ? setIsComment(!isComment)
                : navigate(`/post/${post.post_id}`)
            }
            label="comment"
            className="buttonName buttonOutline buttonSmall"
            name={currentPost?.comments}
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
      {comments &&
        comments.length > 0 &&
        comments.map((comment) => (
          <CommentCard key={comment.comment_id} comment={comment} />
        ))}
      {comments && (
        <Button
          type="button"
          onClick={async () => await getComments(page + 1, true)}
          label="moreComments"
          className="buttonOutline"
          name="More comments"
        />
      )}
    </>
  );
};
