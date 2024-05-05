import './style/Loading.scss';

type OnlyComponent = {
	onlyComponent: boolean;
	border: string;
};

export function Loading({onlyComponent, border}: OnlyComponent) {
	return (
		<div
			id='loading'
			className={onlyComponent ? 'onlyComponent' : ''}
			style={{border}}
		>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}
