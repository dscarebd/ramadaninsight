interface FlagProps {
  className?: string;
}

export const BDFlag = ({ className = 'h-4 w-5 inline-block' }: FlagProps) => (
  <svg viewBox="0 0 5 3" className={className} aria-label="Bangladesh">
    <rect width="5" height="3" fill="#006a4e" />
    <circle cx="2.1" cy="1.5" r="0.9" fill="#f42a41" />
  </svg>
);

export const GBFlag = ({ className = 'h-4 w-5 inline-block' }: FlagProps) => (
  <svg viewBox="0 0 60 30" className={className} aria-label="United Kingdom">
    <clipPath id="gb"><rect width="60" height="30" /></clipPath>
    <g clipPath="url(#gb)">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#gb)" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);
