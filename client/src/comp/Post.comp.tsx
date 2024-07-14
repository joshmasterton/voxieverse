import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { Button } from './Button.comp';
import { MdModeComment } from 'react-icons/md';
import { SerializedUser } from '../../types/utilities/request.utilities.types';
import '../style/comp/Post.comp.scss';

export const Post = ({ user }: { user: SerializedUser }) => {
  return (
    <div className="post">
      <header>
        <img alt="" src={user?.profile_picture} />
        <div>
          <div>{user?.username}</div>
          <p>{user?.email}</p>
        </div>
      </header>
      <main>
        {user?.profile_picture && (
          <div className="imgCon">
            <img alt="" src={user?.profile_picture} />
          </div>
        )}
        <div>
          Post content that will have user context and also maybe an image Post
          content that will have user context and also maybe an image
        </div>
      </main>
      <footer>
        <Button
          type="button"
          onClick={() => {}}
          label="like"
          className="buttonName buttonOutline buttonSmall"
          name={user?.likes}
          SVG={<BiSolidLike />}
        />
        <Button
          type="button"
          onClick={() => {}}
          label="dislike"
          className="buttonName buttonOutline buttonSmall"
          name={user?.dislikes}
          SVG={<BiSolidDislike />}
        />
        <Button
          type="button"
          onClick={() => {}}
          label="comment"
          className="buttonName buttonOutline buttonSmall"
          name={user?.comments}
          SVG={<MdModeComment />}
        />
      </footer>
    </div>
  );
};
