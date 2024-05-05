import {
	type ChangeEvent, useState, useEffect, useRef,
	type FormEvent,
} from 'react';
import {Loading} from '../comp/Loading';
import {fetchAddPost} from '../fetchRequests/postFetchRequests';
import {useUser} from '../context/UserContext';
import {usePopup} from '../context/PopupContext';
import {useNavigate} from 'react-router-dom';
import {NavReturn} from '../comp/NavReturn';
import './style/AddPost.scss';

export function AddPost() {
	const navigate = useNavigate();
	const {user} = useUser();
	const [post, setPost] = useState('');
	const {setPopup} = usePopup();
	const [loading, setLoading] = useState(false);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const {value} = e.target;
		setPost(value);
	};

	const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setTimeout(async () => {
			try {
				const postResponse = await fetchAddPost<string>(post);

				if (postResponse?.validationError) {
					setPopup(postResponse.validationError);
				} else {
					navigate('/');
				}

				setLoading(false);
			} catch (err) {
				if (err instanceof Error) {
					setPopup(err.message);
				}
			}
		}, 400);
	};

	const handleResizeTextarea = () => {
		if (textAreaRef.current) {
			const {current} = textAreaRef;
			current.style.height = 'auto';
			current.style.height = `${current.scrollHeight}px`;
		}
	};

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user]);

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

	return (
		<div id='addPost'>
			<NavReturn/>
			<h1>New post</h1>
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
					{loading ? <Loading onlyComponent={false} marginTop='' height='100%' border='0'/> : 'Send'}
				</button>
			</form>
		</div>
	);
}
