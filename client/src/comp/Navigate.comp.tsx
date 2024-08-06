import { Link } from 'react-router-dom';
import { NavigateProps } from '../../types/comp/Navigate.comp.types';
import { MouseEvent } from 'react';
import '../style/comp/Navigate.comp.scss';

export const Navigate = ({
  to,
  name,
  onClick,
  SVG,
  className
}: NavigateProps) => {
  return (
    <Link
      to={to}
      onTouchStart={(e) => {
        e.currentTarget.blur();
      }}
      onClick={(e?: MouseEvent<HTMLAnchorElement>) => {
        e?.currentTarget.blur();
        onClick();
      }}
      className={className}
    >
      {SVG}
      {name}
    </Link>
  );
};
