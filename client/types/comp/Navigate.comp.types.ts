import { MouseEvent, ReactNode } from 'react';

export type NavigateProps = {
  to: string;
  name?: string;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  SVG?: ReactNode;
};
