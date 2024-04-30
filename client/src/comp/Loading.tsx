import './style/Loading.scss';

export function Loading({onlyComponent}: {onlyComponent: boolean}) {
	return (
		<div id='loading' className={onlyComponent ? 'onlyComponent' : ''}>
			<div>
				<div/>
			</div>
		</div>
	);
}
