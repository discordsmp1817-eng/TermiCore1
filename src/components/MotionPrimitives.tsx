import React from 'react';
import { motion } from 'motion/react';

export const INDUSTRIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface RevealBlockProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function RevealBlock({
  children,
  className = '',
  delay = 0,
  y = 14,
}: RevealBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.36, delay, ease: INDUSTRIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
