import {
	type ChangeEvent, type FormEvent, useState, useEffect,
} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {LightMode} from '../context/LightModeContext';
import {Nav} from '../comp/Nav';
import {type ValidationResult, validation, Validator} from './Validator';
import {BiUser} from 'react-icons/bi';
import {BsEyeFill} from 'react-icons/bs';
import {RiLockFill} from 'react-icons/ri';
import './style/Auth.scss';

export type LoginInfo = {
	username: string;
	password: string;
};

type ShowPasswords = {
	password: boolean;
};

export function Login() {
	const navigate = useNavigate();
	const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);
	const [showPasswords, setShowPasswords] = useState<ShowPasswords>({password: false});
	const [loginInfo, setLoginInfo] = useState<LoginInfo>({
		username: '',
		password: '',
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(loginInfo);
		navigate('/');
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setLoginInfo(prevState => ({
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
		setValidationResult(validation(loginInfo));
	}, [loginInfo]);

	return (
		<form method='POST' id='auth' autoComplete='off' onSubmit={e => {
			handleSubmit(e);
		}}>
			<Nav/>
			<header>
				<h1>Login</h1>
				<LightMode/>
			</header>
			<main>
				<label>
					<BiUser/>
					<input
						type='text'
						name='username'
						value={loginInfo.username}
						onChange={e => {
							handleInputChange(e);
						}}
						placeholder='Username'
						maxLength={30}
					/>
				</label>
				{validationResult?.name === 'username' && <Validator value={validationResult.message}/>}
				<div className='label'>
					<label>
						<RiLockFill/>
						<input
							type={showPasswords.password ? 'text' : 'password'}
							name='password'
							value={loginInfo.password}
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
						<BsEyeFill/>
					</button>
				</div>
				{validationResult?.name === 'password' && <Validator value={validationResult.message}/>}
				<Link to='/forgottenPassword'>Forgotten Password</Link>
				<button type='submit'>
					Login
				</button>
			</main>
			<footer>
				<p>Dont have an account?</p>
				<Link to='/signup'>Signup</Link>
			</footer>
		</form>
	);
}
