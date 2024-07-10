import { Link } from 'react-router-dom';
import { NavigateProps } from '../../types/comp/Navigate.comp.types';
import '../style/comp/Navigate.comp.scss';

export const Navigate = ({ to, name, onClick, SVG }: NavigateProps) => {
  return (
    <Link to={to} onClick={onClick}>
      {name}
      {SVG}
    </Link>
  );
};
