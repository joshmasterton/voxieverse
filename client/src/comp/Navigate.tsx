import { Link } from 'react-router-dom';
import { NavigateProps } from '../../types/comp/Navigate.types';
import '../style/comp/Navigate.scss';

export const Navigate = ({ to, name, onClick, SVG }: NavigateProps) => {
  return (
    <Link to={to} onClick={onClick}>
      {name}
      {SVG}
    </Link>
  );
};
