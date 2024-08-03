import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { PopupContextType } from '../../types/context/Popup.context.types';
import { Button } from '../comp/Button.comp';
import '../style/context/Popup.context.scss';

const PopupContext = createContext<PopupContextType | null>(null);

export const usePopup = () => {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error('usePopup muse be used within PopupProvider');
  }

  return context;
};

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [popup, setPopup] = useState('');
  const [isPopup, setIsPopup] = useState(false);

  return (
    <PopupContext.Provider value={{ popup, isPopup, setPopup, setIsPopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export const Popup = () => {
  const { popup, isPopup, setPopup, setIsPopup } = usePopup();

  useEffect(() => {
    if (!isPopup) {
      setPopup('');
    }
  }, [isPopup]);

  useEffect(() => {
    if (popup !== '') {
      setIsPopup(true);
    }
  }, [popup]);

  return (
    <div id="popup" className={isPopup ? 'active' : 'hidden'}>
      <header id="blur" />
      <div>
        <header>
          <h1>Oops!</h1>
        </header>
        <main>{popup}</main>
        <footer>
          <Button
            type="button"
            onClick={() => setIsPopup(false)}
            label="popupClose"
            className="buttonShade"
            name="Okay"
          />
        </footer>
      </div>
    </div>
  );
};
