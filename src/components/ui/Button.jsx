import React from 'react';

/**
 * Button Component
 * 
 * A reusable button component with different variants and sizes.
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-600/50',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 disabled:bg-purple-600/50',
    outline: 'bg-transparent border border-white/30 hover:bg-white/10 text-white focus:ring-white/30 disabled:text-white/50',
    ghost: 'bg-transparent hover:bg-white/10 text-white focus:ring-white/20 disabled:text-white/50',
    destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-600/50'
  };
  
  // Combine classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

