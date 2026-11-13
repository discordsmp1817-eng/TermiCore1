import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCT_CATEGORIES, ProductCategory } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from './EngineeringImage';
import { SpecTable } from './SpecTable';
import {
  GlowCard,
  INDUSTRIAL_EASE,
  RevealBlock,
  StaggerGrid,
} from './MotionPrimitives';

interface ProductCatalogSectionProps {
  compactHeading?: boolean;
}

export function ProductCatalogSection({
  compactHeading = false,
}: ProductCatalogSectionProps) {
  const { navigate, addToRfq } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const visibleCategories = expandedCategoryId
    ? PRODUCT_CATEGORIES.filter((c) => c.id === expandedCategoryId)
    : activeFilter === 'all'
    ? PRODUCT_CATEGORIES
    : PRODUCT_CATEGORIES.filter((c) => c.id === activeFilter);

  const expandedCategory: ProductCategory | undefined = PRODUCT_CATEGORIES.find(
    (c) => c.id === expandedCategoryId
  );

  // Keep downstream ScrollTriggers aligned whenever cards hide/expand
  useEffect(() => {
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 260);
    return () => window.clearTimeout(timer);
  }, [expandedCategoryId, activeFilter]);

  const handleToggleSpecs = (catId: string) => {
    setExpandedCategoryId((prev) => {
      const next = prev === catId ? null : catId;
      if (next) {
        requestAnimationFrame(() => {
          sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
      return next;
    });
  };

  return (
    <section
      ref={sectionRef}
      id="products"
      className="bg-[#EEF2F6] border-y border-slate-200 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <RevealBlock className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
              Connection Technologies
            </p>
            <h2
              className={`mt-2 font-display font-bold tracking-tight text-[#0F172A] text-balance ${
                compactHeading
                  ? 'text-2xl sm:text-3xl'
                  : 'text-3xl sm:text-4xl'
              }`}
            >
              Terminal Block Series &amp; Technical Matrices
            </h2>
            <p className="mt-3 text-base text-[#475569]">
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
              aria-selected={activeFilter === 'all' && !expandedCategoryId}
              onClick={() => {
                setActiveFilter('all');
                setExpandedCategoryId(null);
              }}
              className={`relative rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                activeFilter === 'all' && !expandedCategoryId
                  ? 'text-white'
                  : 'text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A]'
              }`}
            >
              {activeFilter === 'all' && !expandedCategoryId && (
                <motion.span
                  layoutId="catalogFilterPill"
                  transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                  className="absolute inset-0 rounded-md bg-[#0F766E]"
                />
              )}
              <span className="relative z-10">All Series ({PRODUCT_CATEGORIES.length})</span>
            </button>
            {PRODUCT_CATEGORIES.map((cat) => {
              const isTabActive =
                expandedCategoryId === cat.id ||
                (!expandedCategoryId && activeFilter === cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isTabActive}
                  onClick={() => {
                    setActiveFilter(cat.id);
                    setExpandedCategoryId(cat.id);
                  }}
                  className={`relative rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                    isTabActive
                      ? 'text-white'
                      : 'text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A]'
                  }`}
                >
                  {isTabActive && (
                    <motion.span
                      layoutId="catalogFilterPill"
                      transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                      className="absolute inset-0 rounded-md bg-[#0F766E]"
                    />
                  )}
                  <span className="relative z-10">{cat.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </RevealBlock>

        {/* Either Focused Single-Card + Inline Specs View OR Multi-Card Grid */}
        <AnimatePresence mode="wait">
          {expandedCategory ? (
            <motion.div
              key={`focused-${expandedCategory.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: INDUSTRIAL_EASE }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start"
            >
              {/* Selected Product Card */}
              <div className="lg:col-span-4">
                <GlowCard
                  as="article"
                  variant="elevated"
                  active
                  className="group w-full"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#64748B]">
                      <span className="font-mono font-semibold text-[#0F766E]">
                        {expandedCategory.indexNumber}. {expandedCategory.seriesCode}
                      </span>
                      <span>{expandedCategory.classification}</span>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-[#F7F9FB] aspect-[4/3]">
                      <EngineeringImage
                        src={expandedCategory.image}
                        alt={expandedCategory.imageAlt}
                        fallbackTitle={expandedCategory.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    </div>

                    <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-[#0F172A]">
                      {expandedCategory.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                      {expandedCategory.tagline}
                    </p>

                    <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-100 py-3.5 text-xs">
                      <div>
                        <dt className="text-[#64748B]">Wire Range</dt>
                        <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                          {expandedCategory.wireRangeSummary}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#64748B]">Max Current</dt>
                        <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                          {expandedCategory.currentMaxSummary}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#64748B]">Max Voltage</dt>
                        <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                          {expandedCategory.voltageMaxSummary}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-auto pt-5 flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => navigate(expandedCategory.slug)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                      >
                        <span>View Series</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleSpecs(expandedCategory.id)}
                        aria-expanded={true}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#0F766E] bg-[#0F766E]/10 px-3.5 py-2.5 text-xs font-semibold text-[#0F766E] hover:bg-[#0F766E]/15 transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                      >
                        <span>Hide Specs</span>
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        title={`Add ${expandedCategory.title} to RFQ`}
                        aria-label={`Add ${expandedCategory.title} series to RFQ`}
                        onClick={() =>
                          addToRfq({
                            id: expandedCategory.seriesCode,
                            model: expandedCategory.seriesCode,
                            title: expandedCategory.title,
                            category: 'Series Inquiry',
                            specSummary: `${expandedCategory.wireRangeSummary} · Max ${expandedCategory.currentMaxSummary}`,
                          })
                        }
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2.5 text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer min-h-[40px] min-w-[40px]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </GlowCard>
              </div>

              {/* Specification Matrix Panel Replacing Hidden Containers */}
              <div className="lg:col-span-8 rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
                  <div>
                    <div className="font-mono text-xs font-semibold text-[#0F766E]">
                      {expandedCategory.seriesCode} · {expandedCategory.railCompatibility}
                    </div>
                    <h3 className="mt-1 font-display text-xl font-bold text-[#0F172A]">
                      {expandedCategory.title} — Technical Specification Matrix ({expandedCategory.skus.length} Models)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFilter('all');
                        setExpandedCategoryId(null);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-[#F7F9FB] px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors whitespace-nowrap cursor-pointer min-h-[38px]"
                    >
                      <span>Show All Series</span>
                    </button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(expandedCategory.slug)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap cursor-pointer min-h-[38px]"
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
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeFilter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
            >
              <StaggerGrid
                key={activeFilter}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                stagger={0.08}
                y={24}
              >
                {visibleCategories.map((cat) => (
                  <div key={cat.id} data-stagger-item className="flex">
                    <GlowCard
                      as="article"
                      variant="elevated"
                      className="group w-full hover:-translate-y-1"
                    >
                      <div className="p-6 flex flex-col flex-1">
                        {/* Unboxed Typographic Metadata Line (Zero-Pill Rule) */}
                        <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#64748B]">
                          <span className="font-mono font-semibold text-[#0F766E]">
                            {cat.indexNumber}. {cat.seriesCode}
                          </span>
                          <span>{cat.classification}</span>
                        </div>

                        {/* Studio Product Image */}
                        <div className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-[#F7F9FB] aspect-[4/3]">
                          <EngineeringImage
                            src={cat.image}
                            alt={cat.imageAlt}
                            fallbackTitle={cat.title}
                            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                          />
                        </div>

                        <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-[#0F172A]">
                          {cat.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                          {cat.tagline}
                        </p>

                        {/* Hairline Spec Matrix */}
                        <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-100 py-3.5 text-xs">
                          <div>
                            <dt className="text-[#64748B]">Wire Range</dt>
                            <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                              {cat.wireRangeSummary}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[#64748B]">Max Current</dt>
                            <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                              {cat.currentMaxSummary}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[#64748B]">Max Voltage</dt>
                            <dd className="mt-0.5 font-mono font-semibold text-[#0F172A] tabular-nums">
                              {cat.voltageMaxSummary}
                            </dd>
                          </div>
                        </dl>

                        {/* Actions */}
                        <div className="mt-auto pt-5 flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => navigate(cat.slug)}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                          >
                            <span>View Series</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleSpecs(cat.id)}
                            aria-expanded={false}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors whitespace-nowrap cursor-pointer min-h-[40px]"
                          >
                            <span>Expand Specs</span>
                            <ChevronDown className="h-3.5 w-3.5" />
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
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2.5 text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer min-h-[40px] min-w-[40px]"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </GlowCard>
                  </div>
                ))}
              </StaggerGrid>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
