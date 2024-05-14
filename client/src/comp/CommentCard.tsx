import {
	type ChangeEvent, useState, useRef, type FormEvent,
} from 'react';
import {Link} from 'react-router-dom';
import {usePopup} from '../context/PopupContext';
import {
	fetchAddComment, fetchDislikeComment, fetchGetReplies, fetchLikeComment, type CommentType,
} from '../fetchRequests/commentFetchRequests';
import {LoadingButton, LoadingButtonTransparent} from './Loading';
import {FaArrowUpLong, FaArrowDownLong} from 'react-icons/fa6';
import {BiMinus, BiPlus} from 'react-icons/bi';
import {MdModeComment} from 'react-icons/md';
import logo from '../assets/Voxieverse_logo.png';
import './style/CommentCard.scss';

type CommentProps = {
	depth: number;
	comment: CommentType;
	getComments: () => Promise<void>;
};

type CommentProfileProps = {
	comment: CommentType;
};

export function CommentCard({depth = 0, getComments, comment}: CommentProps) {
	const {setPopup} = usePopup();
	const [page, setPage] = useState<number>(0);
	const [isCommentActive, setIsCommentActive] = useState<boolean>(false);
	const [currentComment, setCurrentComment] = useState<CommentType>(comment);
	const [loadingReplies, setLoadingReplies] = useState<boolean>(false);
	const [replies, setReplies] = useState<CommentType[] | undefined>(undefined);
	const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
	const [addComment, setAddComment] = useState('');
	const [loadingMore, setLoadingMore] = useState<boolean>(false);
	const [noMoreReplies, setNoMoreReplies] = useState<boolean>(false);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoadingAdd(true);
		setTimeout(async () => {
			try {
				if (comment?.id) {
					const commentResponse = await fetchAddComment<string | number | undefined>(
						comment?.postId, comment?.id, addComment,
					);

					if (commentResponse?.validationError) {
						setPopup(commentResponse.validationError);
					} else {
						setAddComment('');
						await getComments();
					}

					setLoadingAdd(false);
				}
			} catch (err) {
				if (err instanceof Error) {
					setPopup(err.message);
					setLoadingAdd(false);
				}
			}
		}, 300);
	};

	const getReplies = async (commentId: number) => {
		if (comment) {
			setLoadingReplies(true);
			setTimeout(() => {
				fetchGetReplies(commentId, 'created_at', 0)
					.then(repliesData => {
						if (repliesData) {
							if (repliesData.length >= 10) {
								setNoMoreReplies(true);
							}

							setReplies(repliesData);
						}

						setLoadingReplies(false);
					})
					.catch(err => {
						console.error(err);
						setLoadingReplies(false);
					});
			}, 300);
		}
	};

	const fetchMoreReplies = async () => {
		if (!loadingMore && comment.id) {
			setLoadingMore(true);
			setTimeout(() => {
				fetchGetReplies(comment.id, 'created_at', page + 1)
					.then(replies => {
						console.log(replies);
						setPage(prevPage => prevPage + 1);
						setReplies(prevReplies => {
							if (prevReplies && replies) {
								return [...prevReplies, ...replies];
							}

							return prevReplies;
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

	const hideReplies = () => {
		setReplies(undefined);
	};

	const handleLikeComment = async () => {
		const updatedComment = await fetchLikeComment(comment?.id);

		if (updatedComment?.id) {
			setCurrentComment(updatedComment);
		}
	};

	const handleDislikeComment = async () => {
		const updatedComment = await fetchDislikeComment(comment?.id);

		if (updatedComment?.id) {
			setCurrentComment(updatedComment);
		}
	};

	const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const {value} = e.target;
		setAddComment(value);
	};

	return (
		<>
			<div className='commentCard'>
				<header>
					<Link to={`/profile/${currentComment?.username}`}>
						<img className='logo' alt='' src={logo}/>
					</Link>
					<div/>
					{comment.comments > 0 ? (
						<>
							{replies ? (
								<button type='button' className='replies' onClick={() => {
									hideReplies();
								}}>
									{loadingReplies ? <LoadingButtonTransparent/> : <BiMinus/>}
								</button>
							) : (
								<button type='button' className='replies' onClick={async () => {
									if (comment.id) {
										await getReplies(comment.id);
									}
								}}>
									{loadingReplies ? <LoadingButtonTransparent/> : <BiPlus/>}
								</button>
							)}
						</>
					) : null}
				</header>
				<div>
					<main>
						<div>
							<div>{currentComment?.username}</div>
						</div>
						<div>
							{currentComment?.comment}
						</div>
						<div>
							<button
								type='button'
								aria-label='like'
								className={currentComment?.hasLiked ? 'liked' : ''}
								onClick={async () => {
									await handleLikeComment();
								}}
							>
								<FaArrowUpLong/>
								{currentComment?.likes}
							</button>
							<button
								type='button'
								aria-label='like'
								className={currentComment?.hasDisliked ? 'disliked' : ''}
								onClick={async () => {
									await handleDislikeComment();
								}}
							>
								<FaArrowDownLong/>
								{currentComment?.dislikes}
							</button>
							<button
								type='button'
								aria-label='comment'
								onClick={() => {
									setIsCommentActive(!isCommentActive);
								}}
							>
								<MdModeComment/>
								{currentComment?.comments}
							</button>
						</div>
					</main>
					{isCommentActive ? (
						<footer>
							<form method='POST' onSubmit={e => {
								handleOnSubmit(e);
							}}>
								<label>
									<textarea
										name='comment'
										value={addComment}
										ref={textAreaRef}
										onChange={e => {
											handleInputChange(e);
										}}
										placeholder='Write comment here...'
										maxLength={500}
									/>
								</label>
								<button type='submit'>
									{loadingAdd ? <LoadingButton/> : 'Comment'}
								</button>
							</form>
						</footer>
					) : null}
					{replies ? (
						<>
							{replies?.map(reply => <CommentCard
								key={reply.id}
								depth={depth + 1}
								comment={reply}
								getComments={getComments}
							/>)}
							{noMoreReplies ? (
								<button type='button' className='replies' onClick={async () => fetchMoreReplies()}>
									{loadingMore ? (
										<LoadingButtonTransparent/>
									) : 'Load more replies ...'}
								</button>
							) : null}
						</>
					) : null}
				</div>
			</div>
		</>
	);
}

export function CommentCardProfile({comment}: CommentProfileProps) {
	const [currentComment, setCurrentComment] = useState<CommentType>(comment);

	const handleLikeComment = async () => {
		const updatedComment = await fetchLikeComment(comment?.id);

		if (updatedComment?.id) {
			setCurrentComment(updatedComment);
		}
	};

	const handleDislikeComment = async () => {
		const updatedComment = await fetchDislikeComment(comment?.id);

		if (updatedComment?.id) {
			setCurrentComment(updatedComment);
		}
	};

	return (
		<div className='commentCard profile'>
			<header>
				<Link to={`/profile/${comment?.username}`}>
					<img className='logo' alt='' src={logo}/>
				</Link>
			</header>
			<div>
				<main>
					<div>{currentComment.username}</div>
					<div>{currentComment.comment}</div>
					<div>
						<button
							type='button'
							aria-label='like'
							className={currentComment?.hasLiked ? 'liked' : ''}
							onClick={async () => {
								await handleLikeComment();
							}}
						>
							<FaArrowUpLong/>
							{currentComment?.likes}
						</button>
						<button
							type='button'
							aria-label='like'
							className={currentComment?.hasDisliked ? 'disliked' : ''}
							onClick={async () => {
								await handleDislikeComment();
							}}
						>
							<FaArrowDownLong/>
							{currentComment?.dislikes}
						</button>
						<Link to={`/post/${currentComment.postId}`}
							type='button'
							aria-label='comment'
						>
							<MdModeComment/>
							{currentComment?.comments}
						</Link>
					</div>
				</main>
			</div>
		</div>
	);
}
