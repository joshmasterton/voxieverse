import { Dispatch, SetStateAction } from 'react';

export type PopupContextType = {
  popup: string;
  isPopup: boolean;
  setPopup: Dispatch<SetStateAction<string>>;
  setIsPopup: Dispatch<SetStateAction<boolean>>;
};
