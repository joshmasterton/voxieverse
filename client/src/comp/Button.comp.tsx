import {
  ButtonProps,
  ButtonThemeProps
} from '../../types/comp/Button.comp.types';
import { useTheme } from '../context/Theme.context';
import { BsSunFill } from 'react-icons/bs';
import { MouseEvent } from 'react';
import { PiMoonFill } from 'react-icons/pi';
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
      className={className ?? undefined}
      onClick={(e?: MouseEvent<HTMLButtonElement>) => {
        e?.currentTarget.blur();
        onClick();
      }}
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
        {theme === 'dark' ? <PiMoonFill /> : <BsSunFill />}
        {name}
      </button>
    </div>
  );
};
