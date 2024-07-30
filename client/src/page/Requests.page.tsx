import { Side } from '../comp/Side.comp';
import { useEffect, useState } from 'react';
import { request } from '../utilities/request.utilities';
import { SerializedUser } from '../../types/utilities/request.utilities.types';
import { Button } from '../comp/Button.comp';
import { Loading } from '../comp/Loading.comp';
import { UserCard } from '../comp/card/UserCard.comp';
import { BiUserPlus } from 'react-icons/bi';
import { Navigate } from '../comp/Navigate.comp';
import { useNotification } from '../context/Notification.context';
import '../style/page/Friend.page.scss';

export const Requests = () => {
  const { requests } = useNotification();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [page, setPage] = useState(0);
  const [requestsFriends, setRequestsFriends] = useState<
    SerializedUser[] | undefined
  >(undefined);

  const getRequests = async (currentPage = page, incrememtPage = true) => {
    try {
      setLoadingMore(true);

      const requestsData = await request<unknown, SerializedUser[]>(
        `/getUsers?page=${currentPage}&friends=waiting`,
        'GET'
      );

      if (requestsData) {
        if (requestsData.length < 10) {
          setCanLoadMore(false);
        }

        setRequestsFriends((prevRequests) => {
          if (prevRequests && requestsData.length > 0) {
            return [...prevRequests, ...requestsData];
          }

          if (requestsData.length > 0) {
            return requestsData;
          }

          if (prevRequests) {
            return prevRequests;
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
        setCanLoadMore(false);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (requests > 0) {
      setLoading(true);
      setPage(0);
      setRequestsFriends(undefined);
      getRequests(0).finally(() => {
        setLoading(false);
      });
    }
  }, [requests]);

  return (
    <>
      <div id="friendPage">
        {loading ? (
          <Loading className="full" />
        ) : requests ? (
          <div id="friendPageCon">
            {requestsFriends?.map((request) => (
              <UserCard key={request.user_id} profile={request} isRequest />
            ))}
            {canLoadMore && (
              <Button
                type="button"
                loading={loadingMore}
                onClick={async () => await getRequests()}
                label="getMore"
                className="buttonOutline"
                name="More requests"
              />
            )}
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
