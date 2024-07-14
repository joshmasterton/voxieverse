import { ReactNode } from 'react';

export type ButtonProps = {
  type: 'submit' | 'reset' | 'button' | undefined;
  onClick: () => void;
  label: string;
  className?: string;
  name?: string | number;
  SVG?: ReactNode;
};

export type ButtonThemeProps = {
  name?: string;
};
