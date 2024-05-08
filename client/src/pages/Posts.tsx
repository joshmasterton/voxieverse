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
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [posts, setPosts] = useState<PostType[] | undefined>(undefined);
	const [topPosts, setTopPosts] = useState<PostType[] | undefined>(undefined);
	const [noMorePosts, setNoMorePosts] = useState<boolean>(false);

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user]);

	useEffect(() => {
		setTimeout(() => {
			fetchGetPosts('created_at', page)
				.then(posts => {
					setPosts(posts);
					if (posts) {
						if (posts?.length < 10) {
							setNoMorePosts(true);
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
						setPage(prevPage => prevPage + 1);
						setPosts(prevPosts => {
							if (prevPosts && posts) {
								if (posts.length === 0) {
									setNoMorePosts(true);
								}

								return [...prevPosts, ...posts];
							}

							return prevPosts;
						});
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
						<>
							{posts?.map(post => (
								<PostCard key={post.id} post={post} />
							))}
							{noMorePosts ? null : (
								<button type='button' className='fetchMore' onClick={async () => fetchMorePosts()}>
									{loadingMore ? (
										<LoadingButtonTransparent/>
									) : 'Load more ...'}
								</button>
							)}
						</>
					)}
					<Link to='/addPost' id='add'>
						<BiPlus />
					</Link>
				</div>
				<SidePost
					isLeft={false}
					content={topPosts}
					loading={loading}
				/>
			</>
		);
	}
}
