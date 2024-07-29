import { Nav } from '../comp/Nav.comp';
import { Side, SideUser } from '../comp/Side.comp';
import { useEffect, useState } from 'react';
import { request } from '../utilities/request.utilities';
import { SerializedUser } from '../../types/utilities/request.utilities.types';
import { Button } from '../comp/Button.comp';
import { Loading } from '../comp/Loading.comp';
import { UserCard } from '../comp/card/UserCard.comp';
import { BiUserPlus } from 'react-icons/bi';
import { Navigate } from '../comp/Navigate.comp';
import '../style/page/Friend.page.scss';

export const Requests = () => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [page, setPage] = useState(0);
  const [requests, setRequests] = useState<SerializedUser[] | undefined>(
    undefined
  );

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

        setRequests((prevRequests) => {
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
    getRequests().finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Nav />
      <SideUser />
      <div id="friendPage">
        {loading ? (
          <Loading className="full" />
        ) : requests ? (
          <div id="friendPageCon">
            {requests.map((request) => (
              <UserCard key={request.user_id} profile={request} isRequest />
            ))}
            {canLoadMore && (
              <Button
                type="button"
                loading={loadingMore}
                onClick={async () => getRequests()}
                label="getMore"
                className="buttonOutline"
                name="More requests"
              />
            )}
          </div>
        ) : (
          <div className="empty" />
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
