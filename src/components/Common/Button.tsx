import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'confirm' | 'cancel';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border';
  
  const variantClasses = {
    primary: 'bg-black hover:bg-gray-800 text-white border border-black focus:ring-gray-500',
    secondary: 'bg-white hover:bg-gray-50 text-black border border-black focus:ring-gray-400',
    outline: 'bg-white hover:bg-black hover:text-white text-black border border-black focus:ring-gray-400',
    danger: 'bg-black hover:bg-gray-800 text-white border border-black focus:ring-gray-500',
    confirm: 'bg-black hover:bg-gray-800 text-white border border-black focus:ring-gray-500 transform hover:scale-105 active:scale-95 transition-transform',
    cancel: 'bg-black hover:bg-gray-800 text-white border border-black focus:ring-gray-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};