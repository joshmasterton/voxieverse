import { Side } from '../comp/Side.comp';
import { Loading } from '../comp/Loading.comp';
import { UserCard } from '../comp/card/UserCard.comp';
import { BiUserPlus } from 'react-icons/bi';
import { Navigate } from '../comp/Navigate.comp';
import { useNotification } from '../context/Notification.context';
import '../style/page/Friend.page.scss';

export const Requests = () => {
  const { requests, loading } = useNotification();

  return (
    <>
      <div id="friendPage">
        {loading ? (
          <Loading className="full" />
        ) : requests && requests?.length > 0 ? (
          <div id="friendPageCon">
            {requests?.map((request) => (
              <UserCard key={request?.user_id} profile={request} isRequest />
            ))}
            <div className="empty" />
          </div>
        ) : (
          <div className="empty">No friend requests</div>
        )}
        <Navigate
          to="/users"
          onClick={() => {}}
          SVG={<BiUserPlus />}
          className="buttonPrimary"
        />
      </div>
      <Side />
    </>
  );
};
