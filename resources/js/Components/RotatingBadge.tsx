import React from 'react';

interface RotatingBadgeProps {
  text: string;
  onClick?: () => void;
  showIcon?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const RotatingBadge: React.FC<RotatingBadgeProps> = ({
  text,
  onClick,
  showIcon = false,
  icon,
  className = "fixed top-4 right-4 md:top-8 md:right-8"
}) => {
  // Calculate repetitions based on length
  const getTextRepetitions = (text: string) => {
    const baseRepetitions = 5;
    const textLength = text.length;
    if (textLength <= 4) return 8;
    if (textLength <= 6) return 6;
    return baseRepetitions;
  };

  const repetitions = getTextRepetitions(text);
  const offsetIncrement = 100 / repetitions;

  return (
    <div 
      className={`${className} w-[70px] h-[70px] md:w-[90px] md:h-[90px] lg:w-[140px] lg:h-[140px] ${onClick ? 'cursor-pointer group' : ''} z-[1000] animate-fade-in`}
      style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
      onClick={onClick}
    >
      {/* Spinning SVG Outline */}
      <div className="w-full h-full relative animate-[spin_25s_linear_infinite] group-hover:animate-[spin_10s_linear_infinite] transition-all">
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
          <defs>
            {/* Outer circular path */}
            <path id="circlePath" d="M 100, 25 a 75,75 0 1,1 0,150 a 75,75 0 1,1 0,-150" />
          </defs>
          {/* Soft outer circle border */}
          <circle cx="100" cy="100" r="75" className="fill-transparent stroke-black/10 dark:stroke-white/10 stroke-[1px]" />
          
          {Array.from({ length: repetitions }).map((_, index) => (
            <text key={index} className="text-[14px] font-bold tracking-[2px] uppercase fill-black dark:fill-white tracking-widest opacity-80" style={{ fontFamily: '"Host Grotesk", sans-serif' }}>
              <textPath href="#circlePath" startOffset={`${index * offsetIncrement}%`}>
                {text} •&nbsp;
              </textPath>
            </text>
          ))}
        </svg>
      </div>
      
      {/* Bouncing icon inside center */}
      {showIcon && icon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-[bounce_2s_infinite] flex items-center justify-center group-hover:scale-110 transition-transform text-black dark:text-white">
            {icon}
          </div>
        </div>
      )}
    </div>
  );
};
