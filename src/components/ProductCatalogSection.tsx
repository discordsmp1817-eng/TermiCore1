import { useState, useRef } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCT_CATEGORIES, ProductCategory } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from './EngineeringImage';
import { SpecTable } from './SpecTable';
import { INDUSTRIAL_EASE } from './MotionPrimitives';

interface ProductCatalogSectionProps {
  compactHeading?: boolean;
}

export function ProductCatalogSection({
  compactHeading = false,
}: ProductCatalogSectionProps) {
  const { navigate, addToRfq } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    'spring-cage'
  );
  const specPanelRef = useRef<HTMLDivElement>(null);

  const visibleCategories =
    activeFilter === 'all'
      ? PRODUCT_CATEGORIES
      : PRODUCT_CATEGORIES.filter((c) => c.id === activeFilter);

  const expandedCategory: ProductCategory | undefined = PRODUCT_CATEGORIES.find(
    (c) => c.id === expandedCategoryId
  );

  const handleToggleSpecs = (catId: string) => {
    setExpandedCategoryId((prev) => {
      const next = prev === catId ? null : catId;
      if (next) {
        requestAnimationFrame(() => {
          specPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
      return next;
    });
  };

  return (
    <section id="products" className="bg-[#F8FAFC] border-y border-slate-200 py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
              Connection Technologies
            </p>
            <h2
              className={`mt-2 font-display font-bold tracking-tight text-slate-950 text-balance ${
                compactHeading
                  ? 'text-2xl sm:text-3xl'
                  : 'text-3xl sm:text-4xl'
              }`}
            >
              Terminal Block Series &amp; Technical Matrices
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Filter by clamping architecture and expand live specification tables to inspect rated currents, wire ranges, and mounting rails.
            </p>
          </div>

          {/* Interactive Segmented Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter product technologies"
            className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              className={`relative rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                activeFilter === 'all'
                  ? 'text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {activeFilter === 'all' && (
                <motion.span
                  layoutId="catalogFilterPill"
                  transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                  className="absolute inset-0 rounded-md bg-[#0F172A]"
                />
              )}
              <span className="relative z-10">All Series ({PRODUCT_CATEGORIES.length})</span>
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === cat.id}
                onClick={() => {
                  setActiveFilter(cat.id);
                  setExpandedCategoryId(cat.id);
                }}
                className={`relative rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                  activeFilter === cat.id
                    ? 'text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {activeFilter === cat.id && (
                  <motion.span
                    layoutId="catalogFilterPill"
                    transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                    className="absolute inset-0 rounded-md bg-[#0F172A]"
                  />
                )}
                <span className="relative z-10">{cat.shortTitle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Series Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((cat) => {
            const isExpanded = expandedCategoryId === cat.id;
            return (
              <motion.article
                key={cat.id}
                layout
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
                className={`flex flex-col rounded-lg border bg-white transition-colors ${
                  isExpanded
                    ? 'border-[#0284C7] ring-1 ring-[#0284C7]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-6 flex flex-col flex-1">
                  {/* Unboxed Typographic Metadata Line (Zero-Pill Rule) */}
                  <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500">
                    <span className="font-mono font-semibold text-[#0284C7]">
                      {cat.indexNumber}. {cat.seriesCode}
                    </span>
                    <span>{cat.classification}</span>
                  </div>

                  {/* Studio Product Image */}
                  <div className="mt-4 overflow-hidden rounded-md border border-slate-100 bg-[#F8FAFC] aspect-[4/3]">
                    <EngineeringImage
                      src={cat.image}
                      alt={cat.imageAlt}
                      fallbackTitle={cat.title}
                      className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.03]"
                    />
                  </div>

                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-slate-950">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {cat.tagline}
                  </p>

                  {/* Hairline Spec Matrix */}
                  <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-100 py-3.5 text-xs">
                    <div>
                      <dt className="text-slate-500">Wire Range</dt>
                      <dd className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums">
                        {cat.wireRangeSummary}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Max Current</dt>
                      <dd className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums">
                        {cat.currentMaxSummary}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Max Voltage</dt>
                      <dd className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums">
                        {cat.voltageMaxSummary}
                      </dd>
                    </div>
                  </dl>

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => navigate(cat.slug)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                    >
                      <span>View Series</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleSpecs(cat.id)}
                      aria-expanded={isExpanded}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer min-h-[40px] ${
                        isExpanded
                          ? 'border-[#0284C7] bg-sky-50 text-[#0284C7]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{isExpanded ? 'Hide Specs' : 'Expand Specs'}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      title={`Add ${cat.title} to RFQ`}
                      aria-label={`Add ${cat.title} series to RFQ`}
                      onClick={() =>
                        addToRfq({
                          id: cat.seriesCode,
                          model: cat.seriesCode,
                          title: cat.title,
                          category: 'Series Inquiry',
                          specSummary: `${cat.wireRangeSummary} · Max ${cat.currentMaxSummary}`,
                        })
                      }
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2.5 text-slate-700 hover:border-[#0284C7] hover:text-[#0284C7] transition-colors cursor-pointer min-h-[40px] min-w-[40px]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Inline Expandable Technical Specification Panel */}
        <div ref={specPanelRef}>
          <AnimatePresence mode="wait">
            {expandedCategory && (
              <motion.div
                key={expandedCategory.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
                className="mt-8 rounded-lg border border-slate-200 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
                  <div>
                    <div className="font-mono text-xs font-semibold text-[#0284C7]">
                      {expandedCategory.seriesCode} · {expandedCategory.railCompatibility}
                    </div>
                    <h3 className="mt-1 font-display text-xl font-bold text-slate-950">
                      {expandedCategory.title} — Technical Specification Matrix ({expandedCategory.skus.length} Models)
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(expandedCategory.slug)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap cursor-pointer min-h-[38px]"
                    >
                      <span>Full {expandedCategory.shortTitle} Page</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                </div>

                <SpecTable
                  skus={expandedCategory.skus}
                  categoryTitle={expandedCategory.title}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
