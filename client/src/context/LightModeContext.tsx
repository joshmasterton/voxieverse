import {
	type ReactNode, createContext, useState, useContext,
	useEffect,
} from 'react';
import {BiMoon} from 'react-icons/bi';
import './style/LightMode.scss';

type LightModeContextType = {
	lightMode: string;
	changeLightMode: () => void;
};

const LightModeContext = createContext<LightModeContextType | undefined>(undefined);

export const useLightMode = () => {
	const context = useContext(LightModeContext);
	if (!context) {
		throw new Error('useLightMode cannot be used without LightModeProvider');
	}

	return context;
};

export const LightModeProvider = ({children}: {children: ReactNode}) => {
	const [lightMode, setLightMode] = useState(getLightMode());

	const changeLightMode = () => {
		const currentLightMode = localStorage.getItem('voxieverse_light_mode');

		if (currentLightMode === 'light') {
			localStorage.setItem('voxieverse_light_mode', 'dark');
			setLightMode('dark');
		} else if (currentLightMode === 'dark') {
			localStorage.setItem('voxieverse_light_mode', 'light');
			setLightMode('light');
		} else {
			setLightMode('dark');
		}
	};

	return (
		<LightModeContext.Provider value={{lightMode, changeLightMode}}>
			{children}
		</LightModeContext.Provider>
	);
};

export const getLightMode = () => {
	const currentLightMode = localStorage.getItem('voxieverse_light_mode');

	if (currentLightMode) {
		return currentLightMode;
	}

	localStorage.setItem('voxieverse_light_mode', 'dark');
	return 'dark';
};

export const LightMode = () => {
	const {lightMode, changeLightMode} = useLightMode();

	useEffect(() => {
		document.documentElement.className = lightMode;
	}, [lightMode]);

	return (
		<div id='lightMode'>
			<button
				type='button'
				className={lightMode === 'dark' ? 'left' : 'right'}
				onClick={() => {
					changeLightMode();
				}}
			>
				<BiMoon/>
			</button>
		</div>
	);
};
