import { Link } from 'react-router-dom';
import { NavigateProps } from '../../types/comp/Navigate.comp.types';
import '../style/comp/Navigate.comp.scss';
import { MouseEvent } from 'react';

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
      onClick={(e?: MouseEvent<HTMLAnchorElement>) => {
        e?.currentTarget.blur();
        onClick;
      }}
      className={className}
    >
      {SVG}
      {name}
    </Link>
  );
};
