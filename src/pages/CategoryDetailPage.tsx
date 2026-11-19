import { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Plus,
  LayoutGrid,
  List,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCategory, ACCESSORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import { SpecTable } from '../components/SpecTable';
import {
  filterCategorySkus,
  getCategoryFilterOptions,
  PitchBand,
  ProcessFilter,
} from '../utils/categoryFilters';
import {
  EngineeringRule,
  GlowCard,
  INDUSTRIAL_EASE,
  ImageReveal,
  MagneticButton,
  RevealBlock,
  StaggerGrid,
} from '../components/MotionPrimitives';

interface CategoryDetailPageProps {
  category: ProductCategory;
}

const PCB_SELECTION_PARAMETERS = [
  {
    kicker: 'Connection Technology',
    title: 'Screw, Push-In & Lever',
    detail: 'Rising-cage screw clamps, front spring push-in, and visual orange lever actuators for fast tool-free harness wiring.',
  },
  {
    kicker: 'Pitch Spectrum',
    title: '2.54 mm to 15.0 mm',
    detail: 'High-density 2.54 / 3.5 / 3.81 mm signal pitches up to wide 10.16 / 15.0 mm power spacing for 1000 V IEC creepage.',
  },
  {
    kicker: 'SMT & Wave Soldering',
    title: 'Wave THT & 260°C THR',
    detail: 'Robust through-hole wave-solder pins plus high-temp LCP THR reflow housings ready for automated SMT pick-and-place.',
  },
  {
    kicker: 'Mechanical Coding & Lock',
    title: 'Flanges, Latches & 125 A+',
    detail: 'M2.5/M3 screw flanges, Lock-and-Release ejector levers, 0°/45°/90° entry angles, and high-power feeder variants.',
  },
];

export function CategoryDetailPage({ category }: CategoryDetailPageProps) {
  const { navigate, addToRfq, navFilter } = useApp();
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [wireRangeFilter, setWireRangeFilter] = useState<string>('All');
  const [voltageFilter, setVoltageFilter] = useState<string>('All');
  const [pitchFilter, setPitchFilter] = useState<PitchBand>('All');
  const [processFilter, setProcessFilter] = useState<ProcessFilter>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isPcbCategory =
    category.id === 'pcb-terminal-blocks' || category.id === 'pcb-connectors';

  const filterOptions = useMemo(
    () => getCategoryFilterOptions(category.skus),
    [category.skus]
  );

  useEffect(() => {
    if (navFilter) {
      const nextType =
        navFilter.typeFilter && filterOptions.connectionTypes.includes(navFilter.typeFilter)
          ? navFilter.typeFilter
          : 'All';
      setTypeFilter(nextType);
      setWireRangeFilter('All');
      setVoltageFilter('All');
      setPitchFilter(navFilter.pitchFilter ?? 'All');
      setProcessFilter(navFilter.processFilter ?? 'All');
    } else {
      setTypeFilter('All');
      setWireRangeFilter('All');
      setVoltageFilter('All');
      setPitchFilter('All');
      setProcessFilter('All');
    }
  }, [category.id, navFilter, filterOptions.connectionTypes]);

  const filteredSkus = useMemo(() => {
    return filterCategorySkus(category.skus, {
      typeFilter,
      wireRangeFilter,
      voltageFilter,
      pitchFilter,
      processFilter,
      isPcbCategory,
    });
  }, [
    category.skus,
    typeFilter,
    wireRangeFilter,
    voltageFilter,
    pitchFilter,
    processFilter,
    isPcbCategory,
  ]);

  const hasActiveFilters =
    typeFilter !== 'All' ||
    wireRangeFilter !== 'All' ||
    voltageFilter !== 'All' ||
    pitchFilter !== 'All' ||
    processFilter !== 'All';

  const resetAllFilters = () => {
    setTypeFilter('All');
    setWireRangeFilter('All');
    setVoltageFilter('All');
    setPitchFilter('All');
    setProcessFilter('All');
  };

  return (
    <div>
      {/* Breadcrumb & Hero Summary */}
      <section className="bg-[#F5F7F9] bg-engineering-grid border-b border-[#DCE2E8] py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0F766E] transition-colors cursor-pointer mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to All Products</span>
          </button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            <RevealBlock
              className="lg:col-span-7 flex flex-col justify-between rounded-lg border border-[#DCE2E8] bg-white p-6 sm:p-9 shadow-[0_10px_32px_rgba(16,29,43,0.05)]"
              y={16}
            >
              <div>
                <div className="font-mono text-xs font-semibold text-[#0F766E]">
                  {category.indexNumber}. {category.seriesCode} · {category.classification}
                </div>
                <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101D2B] text-balance">
                  {category.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-[#475569]">
                  {category.description}
                </p>

                <dl className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-[#DCE2E8] py-4 text-xs">
                  <div>
                    <dt className="text-[#657382]">Wire Range</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#101D2B] tabular-nums">
                      {category.wireRangeSummary}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#657382]">Max Current</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#101D2B] tabular-nums">
                      {category.currentMaxSummary}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#657382]">Max Voltage</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#101D2B] tabular-nums">
                      {category.voltageMaxSummary}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#657382]">Mounting</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#0F766E]">
                      {category.railCompatibility}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <MagneticButton
                  type="button"
                  onClick={() =>
                    addToRfq({
                      id: category.seriesCode,
                      model: category.seriesCode,
                      title: category.title,
                      category: 'Series Inquiry',
                      specSummary: `${category.wireRangeSummary} · ${category.currentMaxSummary}`,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer min-h-[44px]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Series to RFQ</span>
                </MagneticButton>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#CBD5E1] bg-[#F5F7F9] px-5 py-2.5 text-sm font-semibold text-[#101D2B] hover:border-[#0F766E] hover:bg-white hover:text-[#0F766E] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Request CAD / Datasheet</span>
                </button>
              </div>
            </RevealBlock>

            <GlowCard
              variant="elevated"
              className="lg:col-span-5 p-4 flex items-center justify-center border-[#DCE2E8]"
            >
              <ImageReveal
                key={category.id}
                direction="center"
                immediate
                className="w-full h-full flex items-center justify-center rounded-md bg-white border border-[#EEF2F6] p-3"
              >
                <EngineeringImage
                  src={category.image}
                  alt={category.imageAlt}
                  fallbackTitle={category.title}
                  className="h-full w-full max-h-[340px] object-contain rounded"
                />
              </ImageReveal>
            </GlowCard>
          </div>

          {isPcbCategory && (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PCB_SELECTION_PARAMETERS.map((param) => (
                <div
                  key={param.title}
                  className="rounded-lg border border-[#DCE2E8] bg-white p-5 transition-colors hover:border-[#0F766E]/45"
                >
                  <p className="font-mono text-xs font-semibold text-[#0F766E]">
                    {param.kicker}
                  </p>
                  <h2 className="mt-1 font-display text-base font-bold text-[#101D2B]">
                    {param.title}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                    {param.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Full Technical Specifications & Interactive Type Filter */}
      <section className="bg-[#EEF2F6] border-b border-[#DCE2E8] px-4 sm:px-6 py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] rounded-xl border border-[#DCE2E8] bg-white p-5 sm:p-8 lg:p-10 shadow-[0_14px_40px_rgba(16,29,43,0.05)]">
          <RevealBlock className="flex flex-col gap-5 mb-7">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                  Technical Cross-Reference
                </p>
                <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-[#101D2B]">
                  {category.seriesCode} Series Specifications ({filteredSkus.length})
                </h2>
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
                  {processFilter !== 'All' && (
                    <span className="rounded border border-[#0F766E]/25 bg-[#0F766E]/8 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0F766E]">
                      Process:{' '}
                      {processFilter === 'thr'
                        ? 'Reflow (THR)'
                        : processFilter === 'tht'
                        ? 'Wave (THT)'
                        : 'Plug / Panel'}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-[#0F766E] hover:text-[#0D9488] transition-colors cursor-pointer"
                  >
                    Reset Selection Filters
                  </button>
                </div>
              )}
            </div>

            {/* Horizontal 3-Select Filter Bar + Grid/Table View Switcher */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 md:max-w-[780px]">
                <div className="relative">
                  <select
                    aria-label="Filter by category"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full h-10 appearance-none rounded-md border border-[#DCE2E8] bg-white pl-3.5 pr-9 text-xs sm:text-[13px] font-medium text-[#334155] shadow-[0_1px_2px_rgba(16,29,43,0.03)] transition-colors hover:border-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 cursor-pointer"
                  >
                    <option value="All">- Category -</option>
                    {filterOptions.connectionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                </div>

                <div className="relative">
                  <select
                    aria-label="Filter by conductor cross section"
                    value={wireRangeFilter}
                    onChange={(e) => setWireRangeFilter(e.target.value)}
                    className="w-full h-10 appearance-none rounded-md border border-[#DCE2E8] bg-white pl-3.5 pr-9 text-xs sm:text-[13px] font-medium text-[#334155] shadow-[0_1px_2px_rgba(16,29,43,0.03)] transition-colors hover:border-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 cursor-pointer"
                  >
                    <option value="All">- Conductor cross section -</option>
                    {filterOptions.wireRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                </div>

                <div className="relative">
                  <select
                    aria-label="Filter by voltage rating"
                    value={voltageFilter}
                    onChange={(e) => setVoltageFilter(e.target.value)}
                    className="w-full h-10 appearance-none rounded-md border border-[#DCE2E8] bg-white pl-3.5 pr-9 text-xs sm:text-[13px] font-medium text-[#334155] shadow-[0_1px_2px_rgba(16,29,43,0.03)] transition-colors hover:border-[#94A3B8] focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/15 cursor-pointer"
                  >
                    <option value="All">- Voltage Rating -</option>
                    {filterOptions.voltages.map((volt) => (
                      <option key={volt} value={volt}>
                        {volt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                </div>
              </div>

              <div
                role="group"
                aria-label="Specification display mode"
                className="flex items-center gap-1.5 self-end md:self-auto shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'cards'}
                  title="Grid view"
                  className={`h-10 w-10 inline-flex items-center justify-center rounded-md border transition-colors cursor-pointer ${
                    viewMode === 'cards'
                      ? 'border-[#0F766E] bg-[#0F766E] text-white shadow-2xs hover:bg-[#0D9488]'
                      : 'border-[#DCE2E8] bg-white text-[#0F766E] hover:border-[#0F766E]/45 hover:bg-[#F5F7F9]'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  aria-label="Table view"
                  aria-pressed={viewMode === 'table'}
                  title="Table view"
                  className={`h-10 w-10 inline-flex items-center justify-center rounded-md border transition-colors cursor-pointer ${
                    viewMode === 'table'
                      ? 'border-[#0F766E] bg-[#0F766E] text-white shadow-2xs hover:bg-[#0D9488]'
                      : 'border-[#DCE2E8] bg-white text-[#0F766E] hover:border-[#0F766E]/45 hover:bg-[#F5F7F9]'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </RevealBlock>

          {filteredSkus.length > 0 ? (
            <SpecTable
              skus={filteredSkus}
              categoryTitle={category.title}
              fallbackImage={category.image}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              hideToolbar
              torqueColumnLabel={
                category.id === 'spring-cage'
                  ? 'Stripping Length'
                  : category.id === 'screw-connection' ||
                    category.id === 'bolt-connection' ||
                    category.id === 'barrier-terminal-blocks'
                  ? 'Torque / Spec'
                  : isPcbCategory
                  ? 'Pitch / Termination Spec'
                  : 'Series Spec'
              }
            />
          ) : (
            <div className="rounded-lg border border-slate-200 bg-[#F7F9FB] p-8 text-center">
              <p className="text-sm text-[#475569]">
                No models match the active category, cross section, and voltage filter combination.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
              >
                <span>Show All {category.skus.length} Models</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Operating Principle & Mechanical Deep-Dive */}
      <section className="bg-white border-b border-slate-200 py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <RevealBlock className="lg:col-span-6">
              <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                Engineering Mechanism
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0F172A] text-balance">
                {category.principleTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#475569]">
                {category.principleSummary}
              </p>

              <StaggerGrid className="mt-6 space-y-4" stagger={0.08} y={14}>
                {category.principlePoints.map((pt) => (
                  <div key={pt.title} data-stagger-item>
                    <GlowCard variant="light" className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#0F766E] shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-display text-sm font-bold text-[#0F172A]">
                            {pt.title}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                            {pt.detail}
                          </p>
                        </div>
                      </div>
                    </GlowCard>
                  </div>
                ))}
              </StaggerGrid>
            </RevealBlock>

            <RevealBlock className="lg:col-span-6 space-y-6" delay={0.08}>
              {category.steps && (
                <div className="rounded-lg border border-slate-200 bg-[#EEF2F6] p-6 sm:p-8">
                  <h3 className="font-display text-lg font-bold text-[#0F172A]">
                    3-Step Conductor Termination
                  </h3>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {category.steps.map((s) => (
                      <div
                        key={s.step}
                        className="rounded-md border border-slate-200 bg-white p-4"
                      >
                        <div className="font-mono text-xs font-bold text-[#0F766E]">
                          Step 0{s.step}
                        </div>
                        <h4 className="mt-1.5 font-display text-sm font-bold text-[#0F172A]">
                          {s.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                          {s.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Essential Accessories Strip */}
              <div className="rounded-lg border border-slate-200 bg-[#F7F9FB] p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="font-display text-base font-bold text-[#0F172A]">
                    Compatible Mounting &amp; Bridging Accessories
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigate('/accessories')}
                    className="group inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:text-[#0D9488] transition-colors cursor-pointer"
                  >
                    <span>All Accessories</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACCESSORIES.slice(0, 4).map((acc) => (
                    <div
                      key={acc.id}
                      className="rounded-md border border-slate-200 bg-white p-3.5 transition-colors hover:border-[#0F766E]/45"
                    >
                      <div className="font-mono text-[11px] font-semibold text-[#0F766E]">
                        {acc.series}
                      </div>
                      <div className="mt-0.5 text-sm font-bold text-[#0F172A]">
                        {acc.title}
                      </div>
                      <p className="mt-1 text-xs text-[#475569]">{acc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* Technical FAQs */}
      {category.faqs.length > 0 && (
        <section className="bg-[#EEF2F6] py-14 lg:py-20">
          <RevealBlock className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#101D2B] text-center mb-3">
              Technical Frequently Asked Questions
            </h2>
            <EngineeringRule className="max-w-xs mx-auto mb-8" />
            <div className="space-y-3">
              {category.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.question}
                    className={`rounded-lg border transition-colors duration-200 overflow-hidden bg-white ${
                      isOpen
                        ? 'border-[#0F766E]/45 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-display text-sm sm:text-base font-semibold text-[#0F172A] cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-[#0F766E] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: INDUSTRIAL_EASE }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-[#475569]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </RevealBlock>
        </section>
      )}
    </div>
  );
}
