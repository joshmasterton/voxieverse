import {UserProfile} from './UserProfile';
import './style/Side.scss';

export function Side({side}: {side: string}) {
	return (
		<div className={`side ${side}`}>
			{side === 'left' && <UserProfile/>}
			<div/>
			<div/>
			<div/>
			<div/>
		</div>
	);
}
