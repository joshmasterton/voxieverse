import { type SetStateAction, type ReactNode, type Dispatch } from 'react';

export type InputProps<T> = {
  id: string;
  type: string;
  value?: string;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  setValue: Dispatch<SetStateAction<T>>;
  SVG?: ReactNode;
  isTextarea?: boolean;
};
