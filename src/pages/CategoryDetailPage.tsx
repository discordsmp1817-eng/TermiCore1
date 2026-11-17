import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, CheckCircle2, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCategory, ACCESSORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import { SpecTable } from '../components/SpecTable';
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

type PitchBand = 'All' | 'fine' | 'standard' | 'power';
type ProcessFilter = 'All' | 'tht' | 'thr' | 'plug';

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

function getPitchBand(pitch?: string): PitchBand {
  if (!pitch) return 'standard';
  const num = parseFloat(pitch);
  if (Number.isNaN(num)) return 'standard';
  if (num < 4.5) return 'fine';
  if (num < 7.0) return 'standard';
  return 'power';
}

function matchesProcess(mounting: string, process: ProcessFilter): boolean {
  const m = mounting.toLowerCase();
  if (process === 'thr') return m.includes('thr') || m.includes('reflow');
  if (process === 'tht') return m.includes('wave') || m.includes('tht') || m.includes('solder');
  if (process === 'plug') return m.includes('plug') || m.includes('panel');
  return true;
}

export function CategoryDetailPage({ category }: CategoryDetailPageProps) {
  const { navigate, addToRfq } = useApp();
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [pitchFilter, setPitchFilter] = useState<PitchBand>('All');
  const [processFilter, setProcessFilter] = useState<ProcessFilter>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isPcbCategory =
    category.id === 'pcb-terminal-blocks' || category.id === 'pcb-connectors';

  const connectionTypes = useMemo(() => {
    const unique = Array.from(new Set(category.skus.map((s) => s.connectionType)));
    return ['All', ...unique];
  }, [category.skus]);

  const filteredSkus = useMemo(() => {
    return category.skus.filter((s) => {
      if (typeFilter !== 'All' && s.connectionType !== typeFilter) return false;
      if (isPcbCategory && pitchFilter !== 'All' && getPitchBand(s.widthOrPitch) !== pitchFilter) {
        return false;
      }
      if (isPcbCategory && processFilter !== 'All' && !matchesProcess(s.mounting, processFilter)) {
        return false;
      }
      return true;
    });
  }, [category.skus, typeFilter, pitchFilter, processFilter, isPcbCategory]);

  const resetPcbFilters = () => {
    setTypeFilter('All');
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
          <RevealBlock className="flex flex-col gap-5 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                  Technical Cross-Reference
                </p>
                <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-[#101D2B]">
                  {category.seriesCode} Series Specifications ({filteredSkus.length})
                </h2>
              </div>

              {isPcbCategory && (typeFilter !== 'All' || pitchFilter !== 'All' || processFilter !== 'All') && (
                <button
                  type="button"
                  onClick={resetPcbFilters}
                  className="self-start lg:self-auto text-xs font-semibold text-[#0F766E] hover:text-[#0D9488] transition-colors cursor-pointer"
                >
                  Reset Selection Filters
                </button>
              )}
            </div>

            {connectionTypes.length > 2 && (
              <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-[#F7F9FB] p-1.5">
                {connectionTypes.map((type) => {
                  const active = typeFilter === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeFilter(type)}
                      className={`relative rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'text-white'
                          : 'text-[#475569] hover:bg-white hover:text-[#0F172A]'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId={`categoryTypeFilter-${category.id}`}
                          transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                          className="absolute inset-0 rounded-md bg-[#0F766E]"
                        />
                      )}
                      <span className="relative z-10">{type}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {isPcbCategory && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-slate-100 pt-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-xs font-semibold text-[#64748B]">Pitch:</span>
                  {(
                    [
                      { id: 'All', label: 'All Pitches' },
                      { id: 'fine', label: 'Fine (2.54–3.81 mm)' },
                      { id: 'standard', label: 'Standard (5.0–5.08 mm)' },
                      { id: 'power', label: 'Power (7.62–15 mm)' },
                    ] as { id: PitchBand; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPitchFilter(opt.id)}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                        pitchFilter === opt.id
                          ? 'border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]'
                          : 'border-slate-200 bg-white text-[#475569] hover:border-slate-300 hover:text-[#0F172A]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                  <span className="mr-1 text-xs font-semibold text-[#64748B]">Process:</span>
                  {(
                    [
                      { id: 'All', label: 'All' },
                      { id: 'tht', label: 'Wave (THT)' },
                      { id: 'thr', label: 'Reflow (THR)' },
                      { id: 'plug', label: 'Plug / Panel' },
                    ] as { id: ProcessFilter; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setProcessFilter(opt.id)}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                        processFilter === opt.id
                          ? 'border-[#0F766E] bg-[#0F766E]/10 text-[#0F766E]'
                          : 'border-slate-200 bg-white text-[#475569] hover:border-slate-300 hover:text-[#0F172A]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </RevealBlock>

          {filteredSkus.length > 0 ? (
            <SpecTable
              skus={filteredSkus}
              categoryTitle={category.title}
              fallbackImage={category.image}
              torqueColumnLabel={
                category.id === 'spring-cage'
                  ? 'Stripping Length'
                  : category.id === 'screw-connection' || category.id === 'bolt-connection'
                  ? 'Torque / Spec'
                  : isPcbCategory
                  ? 'Pitch / Termination Spec'
                  : 'Series Spec'
              }
            />
          ) : (
            <div className="rounded-lg border border-slate-200 bg-[#F7F9FB] p-8 text-center">
              <p className="text-sm text-[#475569]">
                No models match the active pitch and soldering process combination.
              </p>
              <button
                type="button"
                onClick={resetPcbFilters}
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
