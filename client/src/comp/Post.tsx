import {useState} from 'react';
import {fetchDislikePost, fetchLikePost, type PostType} from '../pages/postFetchRequests';
import {FaArrowUpLong, FaArrowDownLong} from 'react-icons/fa6';
import {MdModeComment} from 'react-icons/md';
import logo from '../assets/Voxieverse_logo.png';
import './style/Post.scss';

export function Post({post}: {post: PostType}) {
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
		<div className='post'>
			<header>
				<button type='button'>
					<img className='logo' alt='' src={logo}/>
				</button>
				<div>
					<div>{currentPost?.username}</div>
					<p>{currentPost?.username}</p>
				</div>
				<p>{currentPost?.createdAt}</p>
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
				<button
					type='button'
					aria-label='like'>
					<MdModeComment/>
					{currentPost?.comments}
				</button>
			</footer>
		</div>
	);
}
