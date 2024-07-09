import { ChangeEvent, MouseEvent, useState } from 'react';
import { InputProps } from '../../types/comp/Input.types';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Button } from './Button';
import '../style/comp/Input.scss';

export const Input = <T,>({
  id,
  type,
  value,
  setValue,
  placeholder,
  className,
  SVG
}: InputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const { files } = e.target;
      if (files?.[0].type.includes('image/')) {
        setProfilePicture(files?.[0].name.slice(0, 10));
        setValue((prevState) => ({
          ...prevState,
          [name]: files?.[0]
        }));
      } else {
        e.target.value = '';
        setProfilePicture('');
        setValue((prevState) => ({
          ...prevState,
          [name]: undefined
        }));
      }
    } else {
      setValue((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleShowPassword = (e: MouseEvent<HTMLButtonElement>) => {
    e?.currentTarget.blur();
    setShowPassword(!showPassword);
  };

  if (className === 'labelPassword') {
    return (
      <div className={className}>
        <label htmlFor={id}>
          {SVG}
          <input
            id={id}
            type={showPassword ? 'text' : type}
            name={id}
            value={value}
            aria-label={id}
            onChange={(e) => handleOnChange(e)}
            placeholder={placeholder}
          />
        </label>
        <Button
          type="button"
          onClick={(e) => handleShowPassword(e)}
          label="showPassword"
          SVG={showPassword ? <BsEyeSlash /> : <BsEye />}
        />
      </div>
    );
  }

  return (
    <label htmlFor={id} className={className}>
      {SVG}
      {profilePicture ? (
        <p>{profilePicture}</p>
      ) : (
        type === 'file' && <div>{placeholder}</div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        name={id}
        aria-label={id}
        onChange={(e) => handleOnChange(e)}
        placeholder={placeholder}
      />
    </label>
  );
};
