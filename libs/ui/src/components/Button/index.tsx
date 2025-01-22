'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const getButtonClasses = (variant: ButtonProps['variant'] = 'primary', size: ButtonProps['size'] = 'md') => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 focus-visible:ring-blue-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-gray-500',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'h-9 px-3',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6',
    icon: 'h-10 w-10',
  };

  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
};

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${getButtonClasses(variant, size)} ${className}`}
      {...props}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
}
