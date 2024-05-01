import './style/Loading.scss';

type OnlyComponent = {
	onlyComponent: boolean;
	marginTop: string;
	height: string;
	border: string;
};

export function Loading({onlyComponent, marginTop, height, border}: OnlyComponent) {
	return (
		<div
			id='loading'
			className={onlyComponent ? 'onlyComponent' : ''}
			style={{
				height,
				marginTop,
				border,
			}}
		>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}
