import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const INDUSTRIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const onChange = () => setIsTouch(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isTouch;
}

/* -------------------------------------------------------------------------- */
/* 1. GSAP Scroll-Triggered Section & Staggered Content Reveal                */
/* -------------------------------------------------------------------------- */

interface RevealBlockProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
}

export function RevealBlock({
  children,
  className = '',
  delay = 0,
  y = 28,
  blur = false,
}: RevealBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          y,
          opacity: 0,
          filter: blur ? 'blur(5px)' : 'blur(0px)',
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.78,
          delay,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter',
          scrollTrigger: {
            trigger: el,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, ref);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [delay, y, blur, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  itemSelector?: string;
  stagger?: number;
  y?: number;
  scaleFrom?: number;
}

export function StaggerGrid({
  children,
  className = '',
  itemSelector = '[data-stagger-item]',
  stagger = 0.09,
  y = 28,
  scaleFrom = 0.96,
}: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll(itemSelector);
      if (!items.length) return;

      gsap.fromTo(
        items,
        {
          y,
          opacity: 0,
          scale: scaleFrom,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.72,
          stagger,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, ref);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [itemSelector, stagger, y, scaleFrom, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. GSAP Clip-Mask + Scale-Down Image Reveal & Optional Parallax            */
/* -------------------------------------------------------------------------- */

export type RevealDirection = 'up' | 'left' | 'right' | 'center';

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  immediate?: boolean;
  parallax?: boolean;
}

const CLIP_INITIAL: Record<RevealDirection, string> = {
  up: 'inset(18% 0% 0% 0%)',
  left: 'inset(0% 20% 0% 0%)',
  right: 'inset(0% 0% 0% 20%)',
  center: 'inset(10% 10% 10% 10%)',
};

export function ImageReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  immediate = false,
  parallax = false,
}: ImageRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner || reducedMotion) return;

    const ctx = gsap.context(() => {
      const scrollCfg = immediate
        ? undefined
        : {
            trigger: wrap,
            start: 'top 84%',
            once: true,
          };

      gsap.fromTo(
        wrap,
        {
          clipPath: CLIP_INITIAL[direction],
          opacity: 0.15,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 0.95,
          delay,
          ease: 'power3.out',
          clearProps: 'clipPath,opacity',
          scrollTrigger: scrollCfg,
        }
      );

      gsap.fromTo(
        inner,
        { scale: 1.1 },
        {
          scale: 1,
          duration: 1.1,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: scrollCfg,
        }
      );

      if (parallax && !isTouch && !immediate) {
        gsap.fromTo(
          inner,
          { yPercent: -3.5 },
          {
            yPercent: 3.5,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      }
    }, wrapRef);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [direction, delay, immediate, parallax, reducedMotion, isTouch]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Meaningful Numeric Count-Up Metric                                      */
/* -------------------------------------------------------------------------- */

interface CountUpMetricProps {
  value: string;
  className?: string;
}

export function CountUpMetric({ value, className = '' }: CountUpMetricProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) {
      setDisplay(value);
      return;
    }

    // Only animate clear leading scalar metrics like "5+", "1000V", "300A".
    // Codes like "IP20" stay static so we don't fake-count standard codes.
    const match = value.match(/^(\d+)([+A-Za-z]*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    const counter = { n: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        n: target,
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          once: true,
        },
        onUpdate: () => {
          setDisplay(`${Math.round(counter.n)}${suffix}`);
        },
        onComplete: () => {
          setDisplay(value);
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [value, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Interactive Mouse-Follow GlowCard (Precision Teal Radial Illumination)  */
/* -------------------------------------------------------------------------- */

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'elevated' | 'light';
  active?: boolean;
  as?: 'div' | 'article';
}

export function GlowCard({
  children,
  className = '',
  variant = 'elevated',
  active = false,
  as = 'div',
  onMouseMove,
  onMouseLeave,
  ...rest
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();
  const reducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(e);
    if (isTouch || reducedMotion || !cardRef.current || !glowRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    glowRef.current.style.opacity = '1';
    glowRef.current.style.background =
      variant === 'dark'
        ? `radial-gradient(400px circle at ${x}px ${y}px, rgba(45, 212, 191, 0.14), transparent 65%)`
        : `radial-gradient(380px circle at ${x}px ${y}px, rgba(13, 148, 136, 0.11), transparent 65%)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(e);
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };

  const surfaceStyles =
    variant === 'light'
      ? active
        ? 'bg-white border-[#0F766E] shadow-[0_14px_34px_rgba(15,23,42,0.09)] ring-1 ring-[#0F766E]/20'
        : 'bg-[#F8FAFC] border-slate-200 hover:border-[#0D9488]/55 hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]'
      : variant === 'dark'
      ? active
        ? 'bg-[#151D26] border-[#0D9488]/65 shadow-[0_14px_36px_rgba(15,23,42,0.35)]'
        : 'bg-[#151D26] border-slate-700 hover:border-[#0D9488]/50 hover:shadow-[0_16px_40px_rgba(15,23,42,0.38)]'
      : active
      ? 'bg-white border-[#0F766E] shadow-[0_14px_34px_rgba(15,23,42,0.09)] ring-1 ring-[#0F766E]/20'
      : 'bg-white border-slate-200 hover:border-[#0D9488]/55 hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]';

  const Tag = as;

  return (
    <Tag
      ref={cardRef as React.RefObject<HTMLDivElement>}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-lg border transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${surfaceStyles} ${className}`}
      {...rest}
    >
      {!isTouch && !reducedMotion && (
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        />
      )}
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Desktop-Only Subtle Magnetic CTA Button                                 */
/* -------------------------------------------------------------------------- */

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.22,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const isTouch = useIsTouchDevice();
  const reducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(e);
    if (isTouch || reducedMotion || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;

    const clampedX = Math.max(-5, Math.min(5, dx));
    const clampedY = Math.max(-4, Math.min(4, dy));

    gsap.to(btnRef.current, {
      x: clampedX,
      y: clampedY,
      duration: 0.28,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(e);
    if (!btnRef.current || isTouch || reducedMotion) return;

    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
