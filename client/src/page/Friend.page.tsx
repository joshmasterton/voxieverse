import { Side } from '../comp/Side.comp';
import { FormEvent, useEffect, useState } from 'react';
import { request } from '../utilities/request.utilities';
import { SerializedUser } from '../../types/utilities/request.utilities.types';
import { Button } from '../comp/Button.comp';
import { Loading } from '../comp/Loading.comp';
import { UserCard } from '../comp/card/UserCard.comp';
import { Input } from '../comp/Input.comp';
import { BiSearch, BiUserPlus } from 'react-icons/bi';
import { Navigate } from '../comp/Navigate.comp';
import '../style/page/Friend.page.scss';

export const Friend = () => {
  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState({
    search: ''
  });
  const [friends, setFriends] = useState<SerializedUser[] | undefined>(
    undefined
  );

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setPage(0);
      setFriends(undefined);
      setLoadingSearch(true);
      setLoading(true);
      await getFriends(0, true, search.search);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
      setLoadingSearch(false);
    }
  };

  const getFriends = async (
    currentPage = page,
    incrememtPage = true,
    search?: string
  ) => {
    try {
      setLoadingMore(true);

      const friendsData = await request<unknown, SerializedUser[]>(
        `/getUsers?page=${currentPage}&friends=friend${search ? `&search=${search}` : ''}`,
        'GET'
      );

      if (friendsData) {
        if (friendsData.length < 10) {
          setCanLoadMore(false);
        }

        setFriends((prevFriends) => {
          if (prevFriends && friendsData.length > 0) {
            return [...prevFriends, ...friendsData];
          }

          if (friendsData.length > 0) {
            return friendsData;
          }

          if (prevFriends) {
            return prevFriends;
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
    getFriends().finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div id="friendPage">
        <form
          method="GET"
          noValidate
          autoComplete="off"
          onSubmit={async (e) => handleSearch(e)}
        >
          <Input
            id="search"
            type="text"
            placeholder="Search friends..."
            className="search"
            SVG={<BiSearch />}
            setValue={setSearch}
            value={search.search}
          />
          <Button
            type="submit"
            loading={loadingSearch}
            onClick={() => {}}
            label="getFriends"
            SVG={<BiSearch />}
            className="buttonPrimary"
          />
        </form>
        {loading ? (
          <Loading className="full" />
        ) : friends ? (
          <div id="friendPageCon">
            {friends.map((friend) => (
              <UserCard key={friend.user_id} profile={friend} />
            ))}
            {canLoadMore && (
              <Button
                type="button"
                loading={loadingMore}
                onClick={async () => await getFriends()}
                label="getMore"
                className="buttonOutline"
                name="More friends"
              />
            )}
          </div>
        ) : (
          <div className="empty">No friends</div>
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
