import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { Button } from './Button.comp';
import { MdModeComment } from 'react-icons/md';
import { SerializedPost } from '../../types/page/Home.page.types';
import { Navigate } from './Navigate.comp';
import '../style/comp/PostCard.comp.scss';

export const PostCard = ({ post }: { post: SerializedPost }) => {
  return (
    <div className="postCard">
      <Navigate to={`/post/${post.post_id}`} onClick={() => {}} />
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
          onClick={() => {}}
          label="comment"
          className="buttonName buttonOutline buttonSmall"
          name={post?.comments}
          SVG={<MdModeComment />}
        />
      </footer>
    </div>
  );
};
