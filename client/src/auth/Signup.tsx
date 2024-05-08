import {
	type ChangeEvent, type FormEvent, useState, useEffect,
} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {LoadingButton} from '../comp/Loading';
import {useUser} from '../context/UserContext';
import {usePopup} from '../context/PopupContext';
import {fetchSignup} from '../fetchRequests/authFetchRequests';
import {LightMode} from '../context/LightModeContext';
import {type ValidationResult, validation, Validator} from './Validator';
import {BiUser} from 'react-icons/bi';
import {BsEyeFill, BsEyeSlashFill} from 'react-icons/bs';
import {MdEmail} from 'react-icons/md';
import {RiLockFill} from 'react-icons/ri';
import logo from '../assets/Voxieverse_logo.png';
import './style/Auth.scss';

export type SignupInfo = {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
};

type ShowPasswords = {
	password: boolean;
	confirmPassword: boolean;
};

export function Signup() {
	const navigate = useNavigate();
	const {setPopup} = usePopup();
	const [loading, setLoading] = useState(false);
	const {user, setUser} = useUser();
	const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);
	const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
		password: false,
		confirmPassword: false,
	});
	const [signupInfo, setSignupInfo] = useState<SignupInfo>({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const signup = await fetchSignup(signupInfo);

		setTimeout(() => {
			if (!signup) {
				setPopup('Login failed');
			} else if ('validationError' in signup) {
				setPopup(signup.validationError);
			} else {
				setUser(signup);
			}

			setLoading(false);
		}, 300);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setSignupInfo(prevState => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleShowPassword = (password: keyof ShowPasswords) => {
		setShowPasswords(prevState => ({
			...prevState,
			[password]: !prevState[password],
		}));
	};

	useEffect(() => {
		setValidationResult(validation(signupInfo));
	}, [signupInfo]);

	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user]);

	return (
		<form method='POST' id='auth' autoComplete='off' onSubmit={async e => {
			await handleSubmit(e);
		}}>
			<img className='logo' alt='' src={logo}/>
			<header>
				<h1>Signup</h1>
				<LightMode/>
			</header>
			<main>
				<label>
					<BiUser/>
					<input
						type='text'
						name='username'
						value={signupInfo.username}
						onChange={e => {
							handleInputChange(e);
						}}
						placeholder='Username'
						maxLength={30}
					/>
				</label>
				{validationResult?.name === 'username' && <Validator value={validationResult.message}/>}
				<label>
					<MdEmail/>
					<input
						type='email'
						name='email'
						value={signupInfo.email}
						onChange={e => {
							handleInputChange(e);
						}}
						placeholder='Email'
						maxLength={60}
					/>
				</label>
				{validationResult?.name === 'email' && <Validator value={validationResult.message}/>}
				<div className='label'>
					<label>
						<RiLockFill/>
						<input
							type={showPasswords.password ? 'text' : 'password'}
							name='password'
							value={signupInfo.password}
							onChange={e => {
								handleInputChange(e);
							}}
							placeholder='Password'
							maxLength={30}
						/>
					</label>
					<button type='button' onClick={() => {
						handleShowPassword('password');
					}}>
						{showPasswords.password ? <BsEyeSlashFill/> : <BsEyeFill/>}
					</button>
				</div>
				{validationResult?.name === 'password' && <Validator value={validationResult.message}/>}
				<div className='label'>
					<label>
						<RiLockFill/>
						<input
							type={showPasswords.confirmPassword ? 'text' : 'password'}
							name='confirmPassword'
							value={signupInfo.confirmPassword}
							onChange={e => {
								handleInputChange(e);
							}}
							placeholder='Confirm Password'
							maxLength={30}
						/>
					</label>
					<button type='button' onClick={() => {
						handleShowPassword('confirmPassword');
					}}>
						{showPasswords.confirmPassword ? <BsEyeSlashFill/> : <BsEyeFill/>}
					</button>
				</div>
				{validationResult?.name === 'confirmPassword' && (
					<Validator value={validationResult.message}/>
				)}
				<button type='submit'>
					{loading ? <LoadingButton/> : 'Signup'}
				</button>
			</main>
			<footer>
				<p>Already have an account?</p>
				<Link to='/login'>Login</Link>
			</footer>
		</form>
	);
}
