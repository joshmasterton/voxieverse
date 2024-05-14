import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';
import {NavReturn} from '../comp/NavReturn';
import {Loading, LoadingButtonTransparent} from '../comp/Loading';
import {SideComment, SideUser} from '../comp/Side';
import {PostCard} from '../comp/PostCard';
import {CommentCard} from '../comp/CommentCard';
import {fetchGetPost, type PostType} from '../fetchRequests/postFetchRequests';
import {type CommentType, fetchGetComments} from '../fetchRequests/commentFetchRequests';
import './style/PostPage.scss';

export function PostPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const postId = location.pathname.split('/').pop();
	const {user} = useUser();
	const [page, setPage] = useState<number>(0);
	const [post, setPost] = useState<PostType | undefined>(undefined);
	const [comments, setComments] = useState<CommentType[] | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingComments, setLoadingComments] = useState<boolean>(true);
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [noMoreComments, setNoMoreComments] = useState<boolean>(true);

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user]);

	useEffect(() => {
		setTimeout(() => {
			if (postId) {
				fetchGetPost(parseInt(postId, 10))
					.then(postData => {
						if (postData) {
							setPost(postData);
						}

						setLoading(false);
					})
					.catch(() => {
						navigate(-1);
						setLoading(false);
					});
			}
		}, 300);
	}, []);

	useEffect(() => {
		getComments()
			.catch(err => {
				console.error(err);
			});
	}, [post]);

	const getComments = async () => {
		if (post && postId) {
			setLoadingComments(true);
			setTimeout(() => {
				fetchGetComments(parseInt(postId, 10), 'created_at', 0)
					.then(commentsData => {
						if (commentsData) {
							if (commentsData.length === 10) {
								setNoMoreComments(false);
							} else {
								setNoMoreComments(true);
							}

							setComments(commentsData);
						}

						setLoadingComments(false);
					})
					.catch(err => {
						console.error(err);
						setLoadingComments(false);
					});
			}, 300);
		}
	};

	const fetchMoreComments = async () => {
		if (!loadingMore && post && postId) {
			setLoadingMore(true);
			setTimeout(() => {
				fetchGetComments(parseInt(postId, 10), 'created_at', page + 1)
					.then(comments => {
						if (comments) {
							if (comments.length === 10) {
								setNoMoreComments(false);
							} else {
								setNoMoreComments(true);
							}
						}

						setPage(prevPage => prevPage + 1);
						setComments(prevComments => {
							if (prevComments && comments) {
								return [...prevComments, ...comments];
							}

							return prevComments;
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
				<NavReturn/>
				<SideUser
					isLeft
					user={user}
				/>
				<div id='postPage'>
					{loading ? (
						<Loading/>
					) : (
						<>
							<div className='postsList'>
								<h2>Post</h2>
								{post ? <PostCard
									post={post}
									getComments={getComments}
									canUserComment
								/> : null}
								<div className='comments'>
									{loadingComments ? (
										<Loading/>
									) : (
										<>
											{comments?.length ?? 0 ? <h2>Comments</h2> : null}
											{comments?.map(comment => <CommentCard
												key={comment.id}
												depth={0}
												getComments={getComments}
												comment={comment}
											/>)}
											{noMoreComments ? null : (
												<button type='button' className='fetchMore' onClick={async () => fetchMoreComments()}>
													{loadingMore ? (
														<LoadingButtonTransparent/>
													) : 'Load more comments...'}
												</button>
											)}
										</>
									)}
								</div>
							</div>
						</>
					)}
				</div>
				<SideComment
					isLeft={false}
					post={post}
					loading={loading}
				/>
			</>
		);
	}
}
