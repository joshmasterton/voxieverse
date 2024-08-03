import { Side } from '../comp/Side.comp';
import { FormEvent, useEffect, useState } from 'react';
import { request } from '../utilities/request.utilities';
import { SerializedUser } from '../../types/utilities/request.utilities.types';
import { Button } from '../comp/Button.comp';
import { Loading } from '../comp/Loading.comp';
import { UserCard } from '../comp/card/UserCard.comp';
import { Input } from '../comp/Input.comp';
import { BiSearch } from 'react-icons/bi';
import '../style/page/Friend.page.scss';

export const Users = () => {
  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState({
    search: ''
  });
  const [users, setUsers] = useState<SerializedUser[] | undefined>(undefined);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setPage(0);
      setUsers(undefined);
      setLoadingSearch(true);
      setLoading(true);
      await getUsers(0, true, search.search);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
      setLoadingSearch(false);
    }
  };

  const getUsers = async (
    currentPage = page,
    incrememtPage = true,
    search?: string
  ) => {
    try {
      setLoadingMore(true);

      const usersData = await request<unknown, SerializedUser[]>(
        `/getUsers?page=${currentPage}${search ? `&search=${search}` : ''}`,
        'GET'
      );

      if (usersData) {
        console.log(usersData);
        if (usersData.length < 10) {
          setCanLoadMore(false);
        }

        setUsers((prevUsers) => {
          if (prevUsers && usersData.length > 0) {
            return [...prevUsers, ...usersData];
          }

          if (usersData.length > 0) {
            return usersData;
          }

          if (prevUsers) {
            return prevUsers;
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
    getUsers().finally(() => {
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
            placeholder="Search users..."
            className="search"
            SVG={<BiSearch />}
            setValue={setSearch}
            value={search.search}
          />
          <Button
            type="submit"
            loading={loadingSearch}
            onClick={() => {}}
            label="getUsers"
            SVG={<BiSearch />}
            className="buttonPrimary"
          />
        </form>
        {loading ? (
          <Loading className="full" />
        ) : users ? (
          <div id="friendPageCon">
            {users.map((user) => (
              <UserCard key={user.user_id} profile={user} />
            ))}
            {canLoadMore && (
              <div className="buttonMore">
                <Button
                  type="button"
                  loading={loadingMore}
                  onClick={async () => await getUsers()}
                  label="getMore"
                  className="buttonShade"
                  name="More users"
                />
              </div>
            )}
            <div className="empty" />
          </div>
        ) : (
          <div className="empty">No users</div>
        )}
      </div>
      <Side />
    </>
  );
};
