'use client';

import { useEffect } from 'react';

type CustomConfirmProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const CustomConfirm = ({
  message,
  onConfirm,
  onCancel,
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

  return (
    <div
      id="custom-confirm"
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-lg">
        <p className="text-lg font-semibold text-center">{message}</p>
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
