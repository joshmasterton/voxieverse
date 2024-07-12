import { Dispatch, ReactNode, SetStateAction } from 'react';
import { SerializedUser } from '../utilities/request.utilities.types';

export type UserContext = {
  user: SerializedUser | undefined;
  setUser: Dispatch<SetStateAction<SerializedUser | undefined>>;
  logout: () => Promise<void>;
};

export type UserProviderProps = {
  children: ReactNode;
};
