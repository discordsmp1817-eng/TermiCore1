import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { resolveAssetUrl } from '../data/termicoreData';

interface EngineeringImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  darkFallback?: boolean;
  priority?: boolean;
}

export function EngineeringImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  darkFallback = false,
  priority = false,
}: EngineeringImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center p-6 text-center ${
          darkFallback
            ? 'bg-[#151D26] text-slate-300 border border-slate-700'
            : 'bg-[#EEF2F6] text-slate-600 border border-slate-200'
        } ${className}`}
      >
        <Cpu className="h-8 w-8 mb-2 text-[#0F766E] opacity-85" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-tight">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolveAssetUrl(src)}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
