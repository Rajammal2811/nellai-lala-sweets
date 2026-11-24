import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-10 max-w-[150px]',
    md: 'h-16 max-w-[210px]',
    lg: 'h-24 max-w-[300px]',
    xl: 'h-32 max-w-[380px]',
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {/* 
        ORIGINAL SHOP LOGO:
        Extracted directly from the official Nellai Lala Sweets shopfront banner.
        - Preserves original colors, shape, typography, and proportions
        - Uses object-fit: contain
      */}
      <img
        src="/nellai-lala-logo.png"
        alt="Nellai Lala Sweets - Official Shop Logo"
        className={`${sizeClasses[size]} w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]`}
        style={{ aspectRatio: '323 / 224' }}
      />
    </div>
  );
};
