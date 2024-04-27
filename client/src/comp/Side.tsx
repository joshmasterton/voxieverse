import './style/Side.scss';

export function Side({side}: {side: string}) {
	return (
		<div className={`side ${side}`}>
			<div/>
			<div/>
			<div/>
			<div/>
			<div/>
		</div>
	);
}
