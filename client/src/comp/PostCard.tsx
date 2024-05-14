import {
	type ChangeEvent, useState, type FormEvent, useEffect,
	useRef,
} from 'react';
import {Link} from 'react-router-dom';
import {usePopup} from '../context/PopupContext';
import {fetchAddComment} from '../fetchRequests/commentFetchRequests';
import {fetchDislikePost, fetchLikePost, type PostType} from '../fetchRequests/postFetchRequests';
import {LoadingButton} from './Loading';
import {FaArrowUpLong, FaArrowDownLong} from 'react-icons/fa6';
import {MdModeComment} from 'react-icons/md';
import logo from '../assets/Voxieverse_logo.png';
import './style/PostCard.scss';

type PostCardProps = {
	post: PostType;
	getComments: undefined | (() => Promise<void>);
	canUserComment: boolean;
};

export function PostCard({post, getComments, canUserComment}: PostCardProps) {
	const {setPopup} = usePopup();
	const [isCommentActive, setIsCommentActive] = useState<boolean>(false);
	const [currentPost, setCurrentPost] = useState<PostType>(post);
	const [addComment, setAddComment] = useState('');
	const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const {value} = e.target;
		setAddComment(value);
	};

	const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (getComments) {
			setLoadingAdd(true);
			setTimeout(async () => {
				try {
					if (post?.id) {
						const commentResponse = await fetchAddComment<string | number | undefined>(
							post?.id, undefined, addComment,
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
		}
	};

	const handleDislikePost = async () => {
		const updatedPost = await fetchDislikePost(post?.id);

		if (updatedPost?.id) {
			setCurrentPost(updatedPost);
		}
	};

	const handleResizeTextarea = () => {
		if (textAreaRef.current) {
			const {current} = textAreaRef;
			current.style.height = 'auto';
			current.style.height = `${current.scrollHeight}px`;
		}
	};

	useEffect(() => {
		handleResizeTextarea();
	}, [addComment]);

	const handleLikePost = async () => {
		const updatedPost = await fetchLikePost(post?.id);

		if (updatedPost?.id) {
			setCurrentPost(updatedPost);
		}
	};

	useEffect(() => {
		window.addEventListener('resize', () => {
			handleResizeTextarea();

			return () => {
				window.removeEventListener('resize', () => {
					handleResizeTextarea();
				});
			};
		});
	}, []);

	return (
		<div className='postCard'>
			<header>
				<Link to={`/profile/${currentPost?.username}`}>
					<img className='logo' alt='' src={logo}/>
				</Link>
				<div>
					<div>{currentPost?.username}</div>
					<p>{currentPost?.createdAt}</p>
				</div>
			</header>
			<main>
				{currentPost?.post}
			</main>
			<footer>
				<button
					type='button'
					aria-label='like'
					className={currentPost?.hasLiked ? 'liked' : ''}
					onClick={async () => {
						await handleLikePost();
					}}
				>
					<FaArrowUpLong/>
					{currentPost?.likes}
				</button>
				<button
					type='button'
					aria-label='like'
					className={currentPost?.hasDisliked ? 'disliked' : ''}
					onClick={async () => {
						await handleDislikePost();
					}}
				>
					<FaArrowDownLong/>
					{currentPost?.dislikes}
				</button>
				<Link
					to={`/post/${post.id}`}
					onClick={() => {
						if (canUserComment) {
							setIsCommentActive(!isCommentActive);
						}
					}}
					aria-label='comment'
				>
					<MdModeComment/>
					{currentPost?.comments}
				</Link>
			</footer>
			{isCommentActive ? (
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
			) : null}
		</div>
	);
}

export function PostCardSmall({post}: {post: PostType}) {
	return (
		<Link to={`/post/${post.id}`} className='postCardSmall'>
			<main>
				{post?.post?.slice(0, 200)}
				{post?.post?.length > 200 ? '...' : ''}
			</main>
			<footer>
				<div className={post?.hasLiked ? 'liked' : ''}>
					<FaArrowUpLong/>
					{post?.likes}
				</div>
				<div className={post?.hasDisliked ? 'disliked' : ''}>
					<FaArrowDownLong/>
					{post?.dislikes}
				</div>
				<div>
					<MdModeComment/>
					{post?.comments}
				</div>
			</footer>
		</Link>
	);
}
