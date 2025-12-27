import React from 'react';

function Button({ children, variant = 'primary', size = 'md', isLoading = false, disabled = false, className = '', type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg';
  const variants = {
    primary: 'bg-gradient-to-br from-primary to-secondary text-white hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed',
    secondary: 'bg-gray-100 text-primary hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5', lg: 'px-6 py-3 text-lg' };

  return (
    <button type={type} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : children}
    </button>
  );
}

export default Button;