import './style/Loading.scss';

export function Loading() {
	return (
		<div
			id='loading'
		>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}

export function LoadingTransparent() {
	return (
		<div
			id='loading'
			className='onlyComponent'
		>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}

export function LoadingButton() {
	return (
		<div
			id='loading'
			className='gradient'
		>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}

export function LoadingButtonTransparent() {
	return (
		<div
			id='loading'
			className='transparent'
		>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}
