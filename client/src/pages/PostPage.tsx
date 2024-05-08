import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';
import {NavReturn} from '../comp/NavReturn';
import {Loading} from '../comp/Loading';
import {PostCard} from '../comp/PostCard';
import {fetchGetPost, type PostType} from '../fetchRequests/postFetchRequests';
import './style/PostPage.scss';

export function PostPage() {
	const navigate = useNavigate();
	const {user} = useUser();
	const location = useLocation();
	const postId = location.pathname.split('/').pop();
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
				<div id='postPage'>
					{loading ? (
						<Loading/>
					) : (
						<>
							{post ? <PostCard post={post}/> : null}
						</>
					)}
				</div>
			</>
		);
	}
}
