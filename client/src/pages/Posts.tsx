import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';
import {type PostType, fetchGetPosts} from '../fetchRequests/postFetchRequests';
import {Nav} from '../comp/Nav';
import {SidePost, SideUser} from '../comp/Side';
import {Loading, LoadingButtonTransparent} from '../comp/Loading';
import {PostCard} from '../comp/PostCard';
import {BiPlus} from 'react-icons/bi';
import './style/Posts.scss';

export function Posts() {
	const navigate = useNavigate();
	const {user} = useUser();
	const [page, setPage] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [noMorePosts, setNoMorePosts] = useState<boolean>(true);
	const [posts, setPosts] = useState<PostType[] | undefined>(undefined);
	const [topPosts, setTopPosts] = useState<PostType[] | undefined>(undefined);

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user]);

	useEffect(() => {
		setTimeout(() => {
			fetchGetPosts('created_at', page)
				.then(posts => {
					if (posts) {
						setPosts(posts);
						if (posts.length === 10) {
							setNoMorePosts(false);
						}
					}

					setLoading(false);
				})
				.catch(err => {
					console.error(err);
					setLoading(false);
				});

			fetchGetPosts('likes', page)
				.then(posts => {
					setTopPosts(posts);
					setLoading(false);
				})
				.catch(err => {
					console.error(err);
					setLoading(false);
				});
		}, 500);
	}, []);

	const fetchMorePosts = async () => {
		if (!loadingMore) {
			setLoadingMore(true);
			setTimeout(() => {
				fetchGetPosts('created_at', page + 1)
					.then(posts => {
						if (posts) {
							if (posts.length === 0) {
								setNoMorePosts(true);
							}

							setPage(prevPage => prevPage + 1);
							setPosts(prevPosts => {
								if (prevPosts && posts) {
									return [...prevPosts, ...posts];
								}

								return prevPosts;
							});
						}

						setLoadingMore(false);
					})
					.catch(err => {
						console.error(err);
						setLoadingMore(false);
					});
			}, 300);
		}
	};

	if (user) {
		return (
			<>
				<Nav/>
				<SideUser
					isLeft
					user={user}
				/>
				<div id='posts'>
					{loading ? (
						<Loading/>
					) : (
						<div className='postsList'>
							<h2>Posts</h2>
							{posts?.map(post => (
								<PostCard key={post.id} post={post} canUserComment={false} getComments={undefined}/>
							))}
							{noMorePosts ? null : (
								<button type='button' className='fetchMore' onClick={async () => fetchMorePosts()}>
									{loadingMore ? (
										<LoadingButtonTransparent/>
									) : 'Load more ...'}
								</button>
							)}
						</div>
					)}
					<Link to='/addPost' id='add'>
						<BiPlus />
					</Link>
				</div>
				<SidePost
					isLeft={false}
					content={topPosts}
					loading={loading}
					title='Top posts'
				/>
			</>
		);
	}
}
