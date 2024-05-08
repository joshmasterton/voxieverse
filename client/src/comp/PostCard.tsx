import {useState} from 'react';
import {Link} from 'react-router-dom';
import {fetchDislikePost, fetchLikePost, type PostType} from '../fetchRequests/postFetchRequests';
import {FaArrowUpLong, FaArrowDownLong} from 'react-icons/fa6';
import {MdModeComment} from 'react-icons/md';
import logo from '../assets/Voxieverse_logo.png';
import './style/PostCard.scss';

export function PostCard({post}: {post: PostType}) {
	const [currentPost, setCurrentPost] = useState<PostType>(post);

	const handleLikePost = async () => {
		const updatedPost = await fetchLikePost(post?.id);

		if (updatedPost?.id) {
			setCurrentPost(updatedPost);
		}
	};

	const handleDislikePost = async () => {
		const updatedPost = await fetchDislikePost(post?.id);

		if (updatedPost?.id) {
			setCurrentPost(updatedPost);
		}
	};

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
					aria-label='like'>
					<MdModeComment/>
					{currentPost?.comments}
				</Link>
			</footer>
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
				<div>
					<FaArrowUpLong/>
					{post?.likes}
				</div>
				<div>
					<FaArrowDownLong/>
					{post?.dislikes}
				</div>
			</footer>
		</Link>
	);
}
