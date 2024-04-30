import {
	type ChangeEvent, type FormEvent, useState, useEffect,
} from 'react';
import {Link} from 'react-router-dom';
import {LightMode} from '../context/LightModeContext';
import {type ValidationResult, validation, Validator} from './Validator';
import {BiUser} from 'react-icons/bi';
import logo from '../assets/Voxieverse_logo.png';
import './style/Auth.scss';

export type ForgottenPasswordType = {
	email: string;
};

export function ForgottenPassword() {
	const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);
	const [forgottenInfo, setForgottenInfo] = useState<ForgottenPasswordType>({
		email: '',
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(forgottenInfo);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setForgottenInfo(prevState => ({
			...prevState,
			[name]: value,
		}));
	};

	useEffect(() => {
		setValidationResult(validation(forgottenInfo));
	}, [forgottenInfo]);

	return (
		<form method='POST' id='auth' autoComplete='off' onSubmit={e => {
			handleSubmit(e);
		}}>
			<img className='logo' alt='' src={logo}/>
			<header>
				<h1>Forgotten Password</h1>
				<LightMode/>
			</header>
			<main>
				<label>
					<BiUser/>
					<input
						type='email'
						name='email'
						value={forgottenInfo.email}
						onChange={e => {
							handleInputChange(e);
						}}
						placeholder='Email'
						maxLength={60}
					/>
				</label>
				{validationResult?.name === 'email' && <Validator value={validationResult.message}/>}
				<button type='submit'>
					Login
				</button>
			</main>
			<footer>
				<p>Dont need to reset your password?</p>
				<Link to='/login'>Login</Link>
			</footer>
		</form>
	);
}
