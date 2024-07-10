import { BiMoon } from 'react-icons/bi';
import {
  ButtonProps,
  ButtonThemeProps
} from '../../types/comp/Button.comp.types';
import { useTheme } from '../context/Theme.context';
import { CgSun } from 'react-icons/cg';
import '../style/comp/Button.comp.scss';

export const Button = ({
  type,
  onClick,
  label,
  className,
  name,
  SVG
}: ButtonProps) => {
  return (
    <button
      type={type}
      aria-label={label}
      className={className}
      onClick={onClick}
    >
      {SVG}
      {name}
    </button>
  );
};

export const ButtonTheme = ({ name }: ButtonThemeProps) => {
  const { theme, changeTheme } = useTheme();

  return (
    <div className="buttonTheme">
      <button
        type="button"
        className={theme}
        aria-label="buttonTheme"
        onClick={changeTheme}
      >
        {theme === 'dark' ? <BiMoon /> : <CgSun />}
        {name}
      </button>
    </div>
  );
};
