import { useEffect, useRef } from 'react';
import { Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductSku } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { usePrefersReducedMotion } from './MotionPrimitives';

gsap.registerPlugin(ScrollTrigger);

interface SpecTableProps {
  skus: ProductSku[];
  categoryTitle: string;
  torqueColumnLabel?: string;
}

export function SpecTable({
  skus,
  categoryTitle,
  torqueColumnLabel = 'Torque / Strip',
}: SpecTableProps) {
  const { rfqItems, addToRfq } = useApp();
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const tbody = tbodyRef.current;
    if (!tbody || reducedMotion) return;

    const ctx = gsap.context(() => {
      const rows = tbody.querySelectorAll('tr');
      if (!rows.length) return;
      gsap.fromTo(
        rows,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.03,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: tbody,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, tbodyRef);

    return () => ctx.revert();
  }, [skus, reducedMotion]);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[#EEF2F6] text-[#0F172A] border-b border-slate-200">
            <th className="sticky left-0 z-10 bg-[#EEF2F6] px-4 py-3.5 font-display text-xs font-semibold tracking-wide text-[#0F766E] whitespace-nowrap">
              Model / Cat No.
            </th>
            <th className="px-4 py-3.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Type
            </th>
            <th className="px-4 py-3.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Wire Range (IEC)
            </th>
            <th className="px-4 py-3.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              UL / Notes
            </th>
            <th className="px-4 py-3.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Current
            </th>
            <th className="px-4 py-3.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Voltage
            </th>
            <th className="px-4 py-3.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Width / Frame
            </th>
            <th className="px-4 py-3.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              {torqueColumnLabel}
            </th>
            <th className="px-4 py-3.5 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Mounting
            </th>
            <th className="px-4 py-3.5 text-right font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Action
            </th>
          </tr>
        </thead>
        <tbody ref={tbodyRef} className="divide-y divide-slate-200">
          {skus.map((sku) => {
            const inRfq = rfqItems.some((item) => item.id === sku.model);
            return (
              <tr
                key={sku.model}
                className="group hover:bg-[#F7F9FB] transition-colors duration-150"
              >
                <td className="sticky left-0 z-10 bg-white group-hover:bg-[#F7F9FB] transition-colors px-4 py-3 font-mono text-xs font-semibold text-[#0F766E] whitespace-nowrap border-r border-slate-100">
                  {sku.model}
                </td>
                <td className="px-4 py-3 text-xs font-medium text-[#0F172A] whitespace-nowrap">
                  {sku.connectionType}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#475569] tabular-nums whitespace-nowrap">
                  {sku.wireRangeIec}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                  {sku.wireRangeUl || '—'}
                </td>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#0F172A] tabular-nums whitespace-nowrap">
                  {sku.currentRating}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#475569] tabular-nums whitespace-nowrap">
                  {sku.voltageRating}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#475569] tabular-nums whitespace-nowrap">
                  {sku.widthOrPitch || '—'}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[#475569] tabular-nums whitespace-nowrap">
                  {sku.torqueOrStrip || '—'}
                </td>
                <td className="px-4 py-3 text-xs text-[#475569] whitespace-nowrap">
                  {sku.mounting}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() =>
                      addToRfq({
                        id: sku.model,
                        model: sku.model,
                        title: sku.name,
                        category: categoryTitle,
                        specSummary: `${sku.wireRangeIec} · ${sku.currentRating} · ${sku.voltageRating}`,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      inRfq
                        ? 'border border-[#0F766E]/35 bg-[#0F766E]/10 text-[#0F766E] hover:bg-[#0F766E]/15'
                        : 'bg-[#0F172A] text-white hover:bg-[#0F766E]'
                    }`}
                  >
                    {inRfq ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>In RFQ</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add to RFQ</span>
                      </>
                    )}
                  </motion.button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
