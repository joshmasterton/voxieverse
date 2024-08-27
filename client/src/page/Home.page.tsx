import { PiPlus } from 'react-icons/pi';
import { Navigate } from '../comp/Navigate.comp';
import { Side } from '../comp/Side.comp';
import { useEffect, useState } from 'react';
import { SerializedPostComment } from '../../types/utilities/request.utilities.types';
import { PostCard } from '../comp/card/PostCard.comp';
import { Button } from '../comp/Button.comp';
import { Loading } from '../comp/Loading.comp';
import { getPosts } from '../utilities/post.utilities';
import '../style/page/Home.page.scss';

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<SerializedPostComment[] | undefined>(
    undefined
  );

  useEffect(() => {
    getPosts(
      page,
      true,
      setPosts,
      setCanLoadMore,
      setPage,
      setLoadingMore
    ).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div id="home">
        {loading ? (
          <Loading className="full" />
        ) : posts && posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {posts && canLoadMore && (
              <div className="buttonMore">
                <Button
                  type="button"
                  loading={loadingMore}
                  onClick={async () =>
                    await getPosts(
                      page,
                      true,
                      setPosts,
                      setCanLoadMore,
                      setPage,
                      setLoadingMore
                    )
                  }
                  label="getMore"
                  name="More posts"
                />
              </div>
            )}
          </>
        ) : (
          <div className="empty"></div>
        )}
        <Navigate
          to="/new"
          onClick={() => {}}
          SVG={<PiPlus />}
          className="buttonPrimary"
        />
      </div>
      <Side />
    </>
  );
};
