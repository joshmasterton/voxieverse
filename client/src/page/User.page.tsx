import { useLocation } from 'react-router-dom';
import { request } from '../utilities/request.utilities';
import { useEffect, useState } from 'react';
import {
  SerializedPostComment,
  SerializedUser
} from '../../types/utilities/request.utilities.types';
import { ReturnNav } from '../comp/ReturnNav';
import { Side, SideUser } from '../comp/Side.comp';
import { Button } from '../comp/Button.comp';
import { BiSolidComment, BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import '../style/page/User.page.scss';
import { PostCard } from '../comp/card/PostCard.comp';

export const User = () => {
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<SerializedPostComment[] | undefined>(
    undefined
  );
  const [user, setUser] = useState<SerializedUser | undefined>(undefined);
  const location = useLocation();
  const user_id = location.pathname.split('/').pop();

  const getUser = async () => {
    try {
      const userFromDb = await request(`/getUser?user_id=${user_id}`, 'GET');
      if (userFromDb) {
        setUser(userFromDb);
      } else {
        throw new Error('No user found');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const getPosts = async (currentPage = page, incrememtPage = true) => {
    try {
      const postsData = await request<unknown, SerializedPostComment[]>(
        `/getPostsComments?page=${currentPage}&type=post&profile_id=${user_id}`,
        'GET'
      );

      if (postsData) {
        setPosts((prevPosts) => {
          if (prevPosts && postsData.length > 0) {
            return [...prevPosts, ...postsData];
          }

          if (postsData.length > 0) {
            return postsData;
          }

          if (prevPosts) {
            return prevPosts;
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
      }
    }
  };

  useEffect(() => {
    setUser(undefined);
    setPosts(undefined);
    setPage(0);
    getUser();
    getPosts(0);
  }, [location]);

  return (
    <>
      <ReturnNav />
      <SideUser />
      <div id="userPage">
        {user && (
          <div id="userPageCon">
            <header>
              <img alt="" src={user?.profile_picture} />
            </header>
            <main>
              <div>
                <div>{user?.username}</div> - <p>{user?.created_at}</p>
              </div>
              <footer>
                <Button
                  type="button"
                  onClick={() => {}}
                  label="like"
                  className="buttonOutline buttonLarge"
                  name={user?.likes}
                  SVG={<BiSolidLike />}
                />
                <Button
                  type="button"
                  onClick={() => {}}
                  label="dislike"
                  className="buttonOutline buttonLarge"
                  name={user?.dislikes}
                  SVG={<BiSolidDislike />}
                />
                <Button
                  type="button"
                  onClick={() => {}}
                  label="comment"
                  className="buttonOutline buttonLarge"
                  name={user?.comments}
                  SVG={<BiSolidComment />}
                />
              </footer>
              <div>
                <Button
                  type="button"
                  onClick={() => {}}
                  label="comment"
                  className={`buttonOutline`}
                  name="Add"
                />
              </div>
            </main>
          </div>
        )}
        {posts && (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            <Button
              type="button"
              onClick={async () => getPosts()}
              label="getMore"
              className="buttonOutline"
              name="More posts"
            />
          </>
        )}
      </div>
      <Side />
    </>
  );
};
