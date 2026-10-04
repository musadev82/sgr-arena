interface LogoIconProps {
  size?: number;
  id?: string;
}

export function LogoIcon({ size = 32, id = 'sgr' }: LogoIconProps) {
  const gradId = `${id}-grad`;
  const innerGradId = `${id}-inner`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SGR Arena logo">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4B96F8" />
          <stop offset="1" stopColor="#1A5FB4" />
        </linearGradient>
        <linearGradient id={innerGradId} x1="14" y1="9" x2="26" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EBF3FD" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="40" height="40" rx="10" fill={`url(#${gradId})`} />

      {/* Outer signal arc — left */}
      <path d="M8 14 Q5.5 20 8 26" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" strokeOpacity="0.45" />
      {/* Inner signal arc — left */}
      <path d="M11 16.5 Q9.5 20 11 23.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" strokeOpacity="0.7" />

      {/* Phone body */}
      <rect x="14" y="9" width="12" height="22" rx="2.5" fill={`url(#${innerGradId})`} />
      {/* Phone screen recess */}
      <rect x="15.5" y="11" width="9" height="14" rx="1.2" fill="#2F80ED" fillOpacity="0.18" />
      {/* Screen glare */}
      <rect x="16.5" y="12" width="3" height="5" rx="0.8" fill="white" fillOpacity="0.35" />
      {/* Camera notch */}
      <rect x="18" y="9.8" width="4" height="1.2" rx="0.6" fill="#2F80ED" fillOpacity="0.35" />
      {/* Home indicator */}
      <rect x="18" y="27.5" width="4" height="1.2" rx="0.6" fill="#2F80ED" fillOpacity="0.4" />

      {/* Inner signal arc — right */}
      <path d="M29 16.5 Q30.5 20 29 23.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" strokeOpacity="0.7" />
      {/* Outer signal arc — right */}
      <path d="M32 14 Q34.5 20 32 26" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" strokeOpacity="0.45" />

      {/* Star dot — review indicator */}
      <circle cx="20" cy="35" r="0" fill="none" />
    </svg>
  );
}

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 44 : 34;
  const textClass = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className="flex items-center gap-2">
      <LogoIcon size={iconSize} />
      {showText && (
        <span className={`font-display font-bold text-ink leading-none ${textClass}`}>
          SGR<span className="text-primary">Arena</span>
        </span>
      )}
    </div>
  );
}
