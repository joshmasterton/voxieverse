import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';
import {NavReturn} from '../comp/NavReturn';
import {Loading} from '../comp/Loading';
import {SideComment, SideUser} from '../comp/Side';
import {PostCard} from '../comp/PostCard';
import {fetchGetPost, type PostType} from '../fetchRequests/postFetchRequests';
import './style/PostPage.scss';

export function PostPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const postId = location.pathname.split('/').pop();
	const {user} = useUser();
	const [post, setPost] = useState<PostType | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);

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
					.catch(err => {
						console.error(err);
						setLoading(false);
					});
			}
		}, 300);
	}, []);

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
								{post ? <PostCard post={post}/> : null}
								<h2>Comments</h2>
								{post ? <PostCard post={post}/> : null}
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
