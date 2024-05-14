import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useUser, type User} from '../context/UserContext';
import {fetchGetComment, type CommentType} from '../fetchRequests/commentFetchRequests';
import {fetchGetPostsFromUser, type PostType} from '../fetchRequests/postFetchRequests';
import {NavReturn} from '../comp/NavReturn';
import {fetchGetUser} from '../fetchRequests/usersFetchRequests';
import {SidePost, SideUser} from '../comp/Side';
import {
	type Friendship, fetchCreateFriendship, fetchDeleteFriendship, fetchGetFriendship,
} from '../fetchRequests/friendshipFetchRequests';
import {CommentCardProfile} from '../comp/CommentCard';
import {Loading, LoadingButtonTransparent} from '../comp/Loading';
import {PostCard} from '../comp/PostCard';
import logo from '../assets/Voxieverse_logo.png';
import './style/Profile.scss';

export function Profile() {
	const navigate = useNavigate();
	const {user} = useUser();
	const [postsPage, setPostsPage] = useState<number>(0);
	const [commentsPage, setCommentsPage] = useState<number>(0);
	const [profileUser, setProfileUser] = useState<User | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [posts, setPosts] = useState<PostType[] | undefined>(undefined);
	const [comments, setComments] = useState<CommentType[] | undefined>(undefined);
	const [friendship, setFriendship] = useState<Friendship | undefined>(undefined);
	const [totalLikes, setTotalLikes] = useState<number>(0);
	const [totalDislikes, setTotalDislikes] = useState<number>(0);
	const [noMorePosts, setNoMorePosts] = useState<boolean>(true);
	const [noMorecomments, setNoMoreComments] = useState<boolean>(true);

	const usernamePath = window?.location.hash.split('/').pop();

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user]);

	useEffect(() => {
		setTimeout(() => {
			fetchGetUser(usernamePath)
				.then(async userData => {
					setProfileUser(userData);
					setLoading(false);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
					navigate(-1);
				});
		}, 300);
	}, []);

	useEffect(() => {
		if (profileUser) {
			setLoading(true);
			fetchGetPostsFromUser(profileUser?.username, postsPage)
				.then(postData => {
					if (postData) {
						if (postData.length === 10) {
							setNoMorePosts(false);
						}

						if (postData[0]) {
							setTotalLikes(postData.reduce((total, post) => total + post.likes, 0));
							setTotalDislikes(postData.reduce((total, post) => total + post.dislikes, 0));
							setPosts(postData);
						} else {
							setPosts(undefined);
						}
					}

					setLoading(false);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
				});

			setLoading(true);

			fetchGetComment(profileUser.username, 'created_at', 0)
				.then(commentData => {
					if (commentData) {
						if (commentData.length === 10) {
							setNoMoreComments(false);
						}

						if (commentData[0]) {
							setTotalLikes(commentData.reduce((total, post) => total + post.likes, 0));
							setTotalDislikes(commentData.reduce((total, post) => total + post.dislikes, 0));
							setComments(commentData);
						} else {
							setComments(undefined);
						}
					}

					setLoading(false);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
				});
		}

		if (profileUser && user && profileUser.username !== user?.username) {
			setLoading(true);
			fetchGetFriendship(profileUser?.username, user?.username)
				.then(friendshipData => {
					setFriendship(friendshipData);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
				});
		}
	}, [profileUser]);

	const addFriend = async () => {
		if (user && profileUser && profileUser?.username !== user?.username) {
			await fetchCreateFriendship(user?.username, profileUser?.username);
			fetchGetFriendship(profileUser?.username, user?.username)
				.then(friendshipData => {
					setFriendship(friendshipData);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
				});
		}
	};

	const deleteFriend = async () => {
		if (user && profileUser && profileUser?.username !== user?.username) {
			await fetchDeleteFriendship(user?.username, profileUser?.username);
			fetchGetFriendship(profileUser?.username, user?.username)
				.then(friendshipData => {
					setFriendship(friendshipData);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
				});
		}
	};

	const fetchMorePosts = async () => {
		if (!loadingMore) {
			setLoadingMore(true);
			setTimeout(() => {
				fetchGetPostsFromUser('created_at', postsPage + 1)
					.then(postsData => {
						setPostsPage(prevPage => prevPage + 1);
						setPosts(prevPosts => {
							if (prevPosts && postsData) {
								if (postsData.length === 10) {
									setNoMorePosts(false);
								}	else {
									setNoMorePosts(true);
								}

								return [...prevPosts, ...postsData];
							}

							return prevPosts;
						});
						setLoadingMore(false);
					})
					.catch(err => {
						console.error(err);
						setLoadingMore(false);
					});
			}, 1000);
		}
	};

	const fetchMoreComments = async () => {
		if (!loadingMore && profileUser) {
			setLoadingMore(true);
			setTimeout(() => {
				fetchGetComment(profileUser?.username, 'created_at', commentsPage + 1)
					.then(commentsData => {
						setCommentsPage(prevPage => prevPage + 1);
						setComments(prevComments => {
							if (prevComments && commentsData) {
								if (commentsData.length < 10) {
									setNoMoreComments(true);
								}

								return [...prevComments, ...commentsData];
							}

							return prevComments;
						});
						setLoadingMore(false);
					})
					.catch(err => {
						console.error(err);
						setLoadingMore(false);
					});
			}, 1000);
		}
	};

	if (user) {
		return (
			<>
				<NavReturn/>
				<SideUser
					isLeft
					user={user}
				/>
				<div id='profile'>
					{loading ? (
						<Loading/>
					) : (
						<>
							{user && (
								<div id='profileUser' className={friendship?.status}>
									<header>
										<img alt='user' src={logo} className='logo'/>
										<div>
											<div>{profileUser?.username}</div>
											<p>{profileUser?.email}</p>
										</div>
										{friendship?.status === 'accepted' && (
											<div>Friends</div>
										)}
										{friendship?.status === 'pending' && friendship.userInitiator === user.username && (
											<div>Waiting for person to respond to friend request</div>
										)}
										{friendship?.status === 'pending' && friendship.userInitiator !== user.username && (
											<div>Waiting for you to responsd to friend request</div>
										)}
									</header>
									<footer>
										<div>
											<div>
												<p>Posts</p>
												<p>{posts ? posts?.length : 0}</p>
											</div>
											<div>
												<p>Likes</p>
												<p>{totalLikes - totalDislikes}</p>
											</div>
										</div>
										{user.username !== profileUser?.username && (
											<>
												<button type='button' aria-label='Add friend' onClick={async () => {
													await addFriend();
												}}>
													Add
												</button>
												<button type='button' className='buttonDanger' aria-label='Remove friend' onClick={async () => {
													await deleteFriend();
												}}>
													Remove
												</button>
											</>
										)}
									</footer>
								</div>
							)}
							<div className='postsList'>
								{posts?.length ?? 0 ? <h2>Posts</h2> : null}
								{posts?.map(post => (
									<PostCard key={post.id} post={post} canUserComment={false} getComments={undefined}/>
								))}
								{noMorePosts ? null : (
									<button type='button' className='fetchMore' onClick={async () => {
										await fetchMorePosts();
									}}>
										{loadingMore ? (
											<LoadingButtonTransparent/>
										) : 'Load more posts'}
									</button>
								)}
								{comments?.length ?? 0 ? <h2>Comments</h2> : null}
								{comments?.map(comment => <CommentCardProfile key={comment.id} comment={comment}/>)}
								{noMorecomments ? null : (
									<button type='button' className='fetchMore' onClick={async () => {
										await fetchMoreComments();
									}}>
										{loadingMore ? (
											<LoadingButtonTransparent/>
										) : 'Load more comments'}
									</button>
								)}
							</div>
						</>
					)}
				</div>
				<SidePost
					isLeft={false}
					content={posts}
					loading={loading}
					title='User posts'
				/>
			</>
		);
	}
}
