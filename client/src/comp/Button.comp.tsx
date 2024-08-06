import {
  ButtonProps,
  ButtonThemeProps
} from '../../types/comp/Button.comp.types';
import { useTheme } from '../context/Theme.context';
import { BsSunFill } from 'react-icons/bs';
import { MouseEvent } from 'react';
import { PiMoonFill } from 'react-icons/pi';
import { Loading } from './Loading.comp';
import '../style/comp/Button.comp.scss';

export const Button = ({
  type,
  onClick,
  label,
  disabled,
  className,
  name,
  loading,
  SVG
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-label={label}
      className={className ?? undefined}
      onTouchStart={(e) => {
        e.currentTarget.blur();
      }}
      onClick={async (e?: MouseEvent<HTMLButtonElement>) => {
        e?.currentTarget.blur();

        setTimeout(() => {
          onClick();
        }, 0);
      }}
    >
      {loading ? (
        <Loading className={className ?? undefined} />
      ) : (
        <>
          {SVG}
          {name}
        </>
      )}
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
