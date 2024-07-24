import { BiSolidComment, BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { SerializedUser } from '../../../types/utilities/request.utilities.types';
import { Button } from '../Button.comp';
import '../../style/comp/card/UserCard.comp.scss';

export const UserCard = ({ user }: { user: SerializedUser }) => {
  console.log(user);
  return (
    <div className="userCard">
      <header>
        <img alt="" src={user.profile_picture} />
        <div>
          <div>{user.username}</div>
          <p>{user.created_at}</p>
        </div>
      </header>
      <main></main>
      <footer>
        <Button
          type="button"
          onClick={() => {}}
          label="like"
          className={`buttonSmall buttonOutline`}
          name={user?.likes}
          SVG={<BiSolidLike />}
        />
        <Button
          type="button"
          onClick={() => {}}
          label="dislike"
          className={`buttonSmall buttonOutline`}
          name={user?.likes}
          SVG={<BiSolidDislike />}
        />
        <Button
          type="button"
          onClick={() => {}}
          label="comment"
          className={`buttonSmall buttonOutline`}
          name={user?.likes}
          SVG={<BiSolidComment />}
        />
      </footer>
    </div>
  );
};
