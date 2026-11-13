import { Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductSku } from '../data/termicoreData';
import { useApp } from '../context/AppContext';

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

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[#0F172A] text-white">
            <th className="sticky left-0 z-10 bg-[#0F172A] px-4 py-3 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Model / Cat No.
            </th>
            <th className="px-4 py-3 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Type
            </th>
            <th className="px-4 py-3 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Wire Range (IEC)
            </th>
            <th className="px-4 py-3 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              UL / Notes
            </th>
            <th className="px-4 py-3 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Current
            </th>
            <th className="px-4 py-3 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Voltage
            </th>
            <th className="px-4 py-3 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Width / Frame
            </th>
            <th className="px-4 py-3 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              {torqueColumnLabel}
            </th>
            <th className="px-4 py-3 font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Mounting
            </th>
            <th className="px-4 py-3 text-right font-display text-xs font-semibold tracking-wide whitespace-nowrap">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {skus.map((sku) => {
            const inRfq = rfqItems.some((item) => item.id === sku.model);
            return (
              <tr
                key={sku.model}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-mono text-xs font-semibold text-[#0284C7] whitespace-nowrap border-r border-slate-100">
                  {sku.model}
                </td>
                <td className="px-4 py-3 text-xs font-medium text-slate-800 whitespace-nowrap">
                  {sku.connectionType}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                  {sku.wireRangeIec}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
                  {sku.wireRangeUl || '—'}
                </td>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                  {sku.currentRating}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                  {sku.voltageRating}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                  {sku.widthOrPitch || '—'}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                  {sku.torqueOrStrip || '—'}
                </td>
                <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
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
                        ? 'border border-sky-200 bg-sky-50 text-[#0284C7] hover:bg-sky-100'
                        : 'bg-slate-900 text-white hover:bg-[#1D4ED8]'
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
