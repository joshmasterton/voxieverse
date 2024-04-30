import {
	type ReactNode, createContext, useContext, useState,
	type Dispatch, type SetStateAction,
	useEffect,
} from 'react';
import './style/Popup.scss';

type PopupContentType = {
	popup: string;
	setPopup: Dispatch<SetStateAction<string>>;
	popupActive: boolean;
	setPopupActive: Dispatch<SetStateAction<boolean>>;
};

const PopupContent = createContext<PopupContentType | undefined>(undefined);

export const usePopup = () => {
	const context = useContext(PopupContent);

	if (!context) {
		throw new Error('Cannot use usePopup without PopupProvider');
	}

	return context;
};

export const PopupProvider = ({children}: {children: ReactNode}) => {
	const [popup, setPopup] = useState('');
	const [popupActive, setPopupActive] = useState(false);

	return (
		<PopupContent.Provider value={{
			popup, setPopup, popupActive, setPopupActive,
		}}>
			{children}
		</PopupContent.Provider>
	);
};

export const Popup = () => {
	const {popup, popupActive, setPopup, setPopupActive} = usePopup();

	useEffect(() => {
		if (popup.length > 0) {
			setPopupActive(true);
		}
	}, [popup]);

	const handleClosePopup = () => {
		setPopupActive(false);
		setTimeout(() => {
			setPopup('');
		}, 500);
	};

	return (
		<div id='popup' className={popupActive ? 'open' : 'hidden'}>
			<button type='button' onClick={() => {
				handleClosePopup();
			}}>
				Close
			</button>
			<div>
				<div>{popup}</div>
				<button type='button' onClick={() => {
					handleClosePopup();
				}}>
					Close
				</button>
			</div>
		</div>
	);
};
