import { MouseEvent, ReactNode } from 'react';

export type ButtonProps = {
  type: 'submit' | 'reset' | 'button' | undefined;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  label: string;
  className?: string;
  name?: string;
  SVG?: ReactNode;
};

export type ButtonThemeProps = {
  name?: string;
};
