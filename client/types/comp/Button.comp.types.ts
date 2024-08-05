import { ReactNode } from 'react';

export type ButtonProps = {
  type: 'submit' | 'reset' | 'button' | undefined;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  name?: ReactNode | string | number;
  SVG?: ReactNode;
};

export type ButtonThemeProps = {
  name?: string;
};
