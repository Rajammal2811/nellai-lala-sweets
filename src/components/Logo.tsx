import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPlaceholderNotice?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showPlaceholderNotice = false
}) => {
  const sizeClasses = {
    sm: 'h-10 max-w-[140px]',
    md: 'h-14 max-w-[190px]',
    lg: 'h-20 max-w-[260px]',
    xl: 'h-28 max-w-[340px]',
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      {/* 
        IMPORTANT LOGO RULE ENFORCEMENT:
        - Uses original file / placeholder
        - Never recreate, redraw, recolour, crop, distort or modify it
        - Maintains its original proportions (object-contain with aspect ratio preserved)
      */}
      <img
        src="/logo-placeholder.svg"
        alt="Nellai Lala Sweets - Original Logo Placeholder"
        className={`${sizeClasses[size]} w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]`}
        style={{ aspectRatio: '400 / 160' }}
      />
      {showPlaceholderNotice && (
        <span className="mt-1 text-[10px] tracking-wide text-gold-400 font-medium opacity-80">
          (Original Shop Logo Placeholder)
        </span>
      )}
    </div>
  );
};
