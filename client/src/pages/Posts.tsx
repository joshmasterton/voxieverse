import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';
import {type PostType, fetchGetPosts} from '../fetchRequests/postFetchRequests';
import {Nav} from '../comp/Nav';
import {Loading} from '../comp/Loading';
import {PostCard} from '../comp/PostCard';
import {CgAdd} from 'react-icons/cg';
import './style/Posts.scss';

export function Posts() {
	const navigate = useNavigate();
	const {user} = useUser();
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState<PostType[] | undefined>(undefined);

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user]);

	useEffect(() => {
		setTimeout(() => {
			fetchGetPosts('created_at')
				.then(posts => {
					setPosts(posts);
					setLoading(false);
				})
				.catch(err => {
					console.error(err);
					setLoading(false);
				});
		}, 1000);
	}, []);

	if (user) {
		return (
			<>
				<Nav/>
				<div id='posts'>
					{loading ? (
						<Loading onlyComponent={false} border=''/>
					) : (
						posts?.map(post => (
							<PostCard key={post.id} post={post} />
						))
					)}
					<Link to='/addPost' id='add'>
						<CgAdd />
					</Link>
				</div>
			</>
		);
	}
}
