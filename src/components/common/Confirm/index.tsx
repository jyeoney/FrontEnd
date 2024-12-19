'use client';

import { useEffect, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

type CustomConfirmProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  requirePasswordInput?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
};

const CustomConfirm = ({
  message,
  onConfirm,
  onCancel,
  requirePasswordInput = false,
  inputValue = '',
  onInputChange = () => {},
}: CustomConfirmProps) => {
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).id === 'custom-confirm') {
        onCancel();
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [onCancel]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div
      id="custom-confirm"
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[28rem] max-w-lg">
        <p className="text-lg font-semibold text-center whitespace-pre-wrap break-words mb-4">
          {message}
        </p>
        {requirePasswordInput && (
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={inputValue}
              onChange={e => onInputChange(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className="w-full input input-bordered px-4 py-2 focus:outline-indigo-500 text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 mr-2"
            >
              {passwordVisible ? (
                <FaRegEye size={20} />
              ) : (
                <FaRegEyeSlash size={20} />
              )}
            </button>
          </div>
        )}
        <div className="mt-6 flex justify-center space-x-4">
          <button className="btn btn-ghost" onClick={onCancel}>
            아니오
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirm;
