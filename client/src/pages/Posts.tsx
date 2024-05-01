import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';
import {type PostType, fetchGetPosts} from './postFetchRequests';
import {Nav} from '../comp/Nav';
import {Loading} from '../comp/Loading';
import {Side} from '../comp/Side';
import {Post} from '../comp/Post';
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
				<Side side='left' />
				<div id='posts'>
					{loading ? (
						<Loading onlyComponent={false} marginTop='' height='100%' border=''/>
					) : (
						posts?.map(post => (
							<Post key={post.id} post={post} />
						))
					)}
					<Link to='/addPost' id='add'>
						<CgAdd />
					</Link>
				</div>
				<Side side='right' />
			</>
		);
	}
}
