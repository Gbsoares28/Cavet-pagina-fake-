import React from 'react';

interface CavetLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'icon';
}

export const CavetLogo: React.FC<CavetLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  // Dimensions map
  const sizeMap = {
    sm: { icon: 32, height: 38 },
    md: { icon: 42, height: 48 },
    lg: { icon: 54, height: 60 },
    xl: { icon: 68, height: 76 },
  };

  const { icon, height } = sizeMap[size];

  if (variant === 'icon') {
    return (
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-label="Logotipo CAVET - Hospital Veterinário"
      >
        <rect width="64" height="64" rx="14" fill="#0B4C8C" />
        {/* Medical Cross background */}
        <path
          d="M26 12H38V26H52V38H38V52H26V38H12V26H26V12Z"
          fill="#00A8B5"
          opacity="0.9"
        />
        {/* Pet Paw inside medical cross */}
        <ellipse cx="26" cy="28" rx="2.8" ry="3.8" fill="#FFFFFF" />
        <ellipse cx="38" cy="28" rx="2.8" ry="3.8" fill="#FFFFFF" />
        <ellipse cx="20.5" cy="33.5" rx="2.4" ry="3.2" fill="#FFFFFF" />
        <ellipse cx="43.5" cy="33.5" rx="2.4" ry="3.2" fill="#FFFFFF" />
        <path
          d="M32 34C27.5 34 24 37 24 40.5C24 43 26 44.5 28.5 44C30.5 43.5 31.2 42.5 32 42.5C32.8 42.5 33.5 43.5 35.5 44C38 44.5 40 43 40 40.5C40 37 36.5 34 32 34Z"
          fill="#FFFFFF"
        />
        {/* Subtle 24h accent badge */}
        <circle cx="50" cy="14" r="8" fill="#F59E0B" />
        <text
          x="50"
          y="17"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="7"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          24h
        </text>
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cavetGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B4C8C" />
            <stop offset="1" stopColor="#082A4D" />
          </linearGradient>
          <linearGradient id="cyanGrad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00C4D4" />
            <stop offset="1" stopColor="#008F9B" />
          </linearGradient>
        </defs>

        <rect width="64" height="64" rx="14" fill="url(#cavetGrad)" />

        {/* Clean Veterinary Cross */}
        <path
          d="M26 13H38V26H51V38H38V51H26V38H13V26H26V13Z"
          fill="url(#cyanGrad)"
        />

        {/* Pet Silhouette / Paw in center */}
        <ellipse cx="26" cy="27" rx="2.7" ry="3.6" fill="#FFFFFF" />
        <ellipse cx="38" cy="27" rx="2.7" ry="3.6" fill="#FFFFFF" />
        <ellipse cx="20.5" cy="32.5" rx="2.3" ry="3.1" fill="#FFFFFF" />
        <ellipse cx="43.5" cy="32.5" rx="2.3" ry="3.1" fill="#FFFFFF" />
        <path
          d="M32 33C27.5 33 24.2 36 24.2 39.5C24.2 42 26.2 43.5 28.5 43C30.3 42.6 31.1 41.6 32 41.6C32.9 41.6 33.7 42.6 35.5 43C37.8 43.5 39.8 42 39.8 39.5C39.8 36 36.5 33 32 33Z"
          fill="#FFFFFF"
        />

        {/* 24h Emergency Badge */}
        <rect x="42" y="6" width="18" height="13" rx="3.5" fill="#F59E0B" />
        <text
          x="51"
          y="15.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="8"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.3"
        >
          24h
        </text>
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-extrabold tracking-tight text-[#0B4C8C]"
            style={{
              fontSize: size === 'xl' ? '2.25rem' : size === 'lg' ? '1.75rem' : size === 'md' ? '1.45rem' : '1.15rem',
              letterSpacing: '-0.03em',
            }}
          >
            CAVET
          </span>
          <span className="text-[11px] font-bold text-[#00A8B5] tracking-widest uppercase">
            TIJUCA
          </span>
        </div>

        {variant === 'full' && (
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold tracking-wider uppercase"
            style={{
              fontSize: size === 'sm' ? '9px' : '10px',
            }}
          >
            <span className="text-slate-600 font-bold">Hospital Veterinário</span>
            <span className="text-slate-300" aria-hidden="true">•</span>
            <span className="text-amber-600 font-bold">24 Horas</span>
          </div>
        )}
      </div>
    </div>
  );
};
