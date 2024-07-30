import { ReactNode } from 'react';

export type NavigateProps = {
  to: string;
  name?: ReactNode;
  onClick: () => void;
  className?: string;
  SVG?: ReactNode;
};
