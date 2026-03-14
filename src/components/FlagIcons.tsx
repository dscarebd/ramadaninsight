import { cn } from '@/lib/utils';

interface FlagProps {
  className?: string;
}

export const BDFlag = ({ className }: FlagProps) => (
  <svg viewBox="0 0 5 3" className={cn('inline-block h-3 w-4 shrink-0', className)}>
    <rect width="5" height="3" fill="#006a4e" />
    <circle cx="2.25" cy="1.5" r="0.9" fill="#f42a41" />
  </svg>
);

export const GBFlag = ({ className }: FlagProps) => (
  <svg viewBox="0 0 60 30" className={cn('inline-block h-3 w-4 shrink-0', className)}>
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);
