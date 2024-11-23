import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="form-control w-full">
      {label && <label className="label">{label}</label>}
      <input 
        className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className ?? ''}`}
        {...props}
      />
      {error && <span className="label text-error text-sm">{error}</span>}
    </div>
  );
}
