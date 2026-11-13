import { useState } from 'react';
import { Cpu } from 'lucide-react';

interface EngineeringImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  darkFallback?: boolean;
}

export function EngineeringImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  darkFallback = false,
}: EngineeringImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center p-6 text-center ${
          darkFallback
            ? 'bg-slate-900 text-slate-300'
            : 'bg-slate-100 text-slate-500'
        } ${className}`}
      >
        <Cpu className="h-8 w-8 mb-2 opacity-60" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-tight">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
