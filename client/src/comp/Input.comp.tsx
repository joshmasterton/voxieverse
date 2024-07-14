import { ChangeEvent, useRef, useState } from 'react';
import { InputProps } from '../../types/comp/Input.comp.types';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { Button } from './Button.comp';
import { CgClose } from 'react-icons/cg';
import '../style/comp/Input.comp.scss';

export const Input = <T,>({
  id,
  type,
  value,
  setValue,
  placeholder,
  className,
  SVG
}: InputProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
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

  const handleRemoveFile = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setProfilePicture('');
      setValue((prevState) => ({
        ...prevState,
        profilePicture: undefined
      }));
    }
  };

  const handleShowPassword = () => {
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
          onClick={() => handleShowPassword()}
          label="showPassword"
          SVG={showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
        />
      </div>
    );
  }

  return (
    <div className="input">
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
          ref={inputRef}
          aria-label={id}
          onChange={(e) => handleOnChange(e)}
          placeholder={placeholder}
        />
      </label>
      {type === 'file' && (
        <Button
          type="button"
          onClick={() => handleRemoveFile()}
          label="removeFile"
          SVG={<CgClose />}
        />
      )}
    </div>
  );
};
