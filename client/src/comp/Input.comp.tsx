import { ChangeEvent, useEffect, useRef, useState } from 'react';
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
  disabled,
  placeholder,
  className,
  SVG,
  isTextarea
}: InputProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRefCon = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const handleResizeChange = () => {
    if (textareaRef.current && textareaRefCon.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRefCon.current.style.height = 'auto';
      textareaRefCon.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    handleResizeChange();

    setValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
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

  useEffect(() => {
    window.addEventListener('resize', handleResizeChange);

    return () => window.removeEventListener('resize', handleResizeChange);
  }, []);

  if (className === 'labelPassword') {
    return (
      <div className={className}>
        <label htmlFor={id}>
          {SVG}
          <input
            id={id}
            type={showPassword ? 'text' : type}
            name={id}
            max={300}
            disabled={disabled}
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
    <div
      ref={isTextarea ? textareaRefCon : null}
      className={isTextarea ? 'textarea' : 'input'}
    >
      <label htmlFor={id} className={className}>
        {SVG}
        {profilePicture ? (
          <p>{profilePicture}</p>
        ) : (
          type === 'file' && <div>{placeholder}</div>
        )}
        {isTextarea ? (
          <textarea
            value={value}
            name={id}
            ref={textareaRef}
            disabled={disabled}
            maxLength={500}
            aria-label={id}
            onChange={(e) => handleTextareaChange(e)}
            placeholder={placeholder}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            name={id}
            max={300}
            disabled={disabled}
            ref={inputRef}
            aria-label={id}
            onChange={(e) => handleOnChange(e)}
            placeholder={placeholder}
          />
        )}
      </label>
      {className === 'search' && (
        <Button
          type="button"
          onClick={() =>
            setValue((prevState) => ({
              ...prevState,
              search: ''
            }))
          }
          label="removeFile"
          SVG={<CgClose />}
        />
      )}
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
