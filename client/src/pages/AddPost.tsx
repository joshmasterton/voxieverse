import {
	type ChangeEvent, useState, useEffect, useRef,
	type FormEvent,
} from 'react';
import {LoadingButton} from '../comp/Loading';
import {type PostType, fetchAddPost, fetchGetPosts} from '../fetchRequests/postFetchRequests';
import {useUser} from '../context/UserContext';
import {usePopup} from '../context/PopupContext';
import {useNavigate} from 'react-router-dom';
import {SidePost, SideUser} from '../comp/Side';
import {NavReturn} from '../comp/NavReturn';
import './style/AddPost.scss';

export function AddPost() {
	const navigate = useNavigate();
	const {user} = useUser();
	const [post, setPost] = useState('');
	const {setPopup} = usePopup();
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
	const [topPosts, setTopPosts] = useState<PostType[] | undefined>(undefined);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user]);

	const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const {value} = e.target;
		setPost(value);
	};

	useEffect(() => {
		setTimeout(() => {
			fetchGetPosts('likes', 0)
				.then(posts => {
					setTopPosts(posts);
					setLoading(false);
				})
				.catch(err => {
					console.error(err);
					setLoading(false);
				});
		}, 500);
	}, []);

	const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoadingAdd(true);
		setTimeout(async () => {
			try {
				const postResponse = await fetchAddPost<string>(post);

				if (postResponse?.validationError) {
					setPopup(postResponse.validationError);
				} else {
					navigate('/');
				}

				setLoadingAdd(false);
			} catch (err) {
				if (err instanceof Error) {
					setPopup(err.message);
					setLoading(false);
				}
			}
		}, 300);
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
	}, [post]);

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

	if (user) {
		return (
			<>
				<NavReturn/>
				<SideUser
					isLeft
					user={user}
				/>
				<div id='addPost'>
					<h2>New post</h2>
					<form method='POST' onSubmit={e => {
						handleOnSubmit(e);
					}}>
						<label>
							<textarea
								name='post'
								value={post}
								ref={textAreaRef}
								onChange={e => {
									handleInputChange(e);
								}}
								placeholder='Write post here...'
								maxLength={500}
							/>
						</label>
						<div>
							<div style={{width: `${(post.length) / 5.4}%`}}/>
							<p>{post?.length}</p>
						</div>
						<button type='submit'>
							{loadingAdd ? <LoadingButton/> : 'Send'}
						</button>
					</form>
				</div>
				<SidePost
					isLeft={false}
					content={topPosts}
					loading={loading}
					title='Top posts'
				/>
			</>
		);
	}
}
