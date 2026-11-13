import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, CheckCircle2, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCategory, ACCESSORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import { SpecTable } from '../components/SpecTable';
import {
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

export function CategoryDetailPage({ category }: CategoryDetailPageProps) {
  const { navigate, addToRfq } = useApp();
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const connectionTypes = useMemo(() => {
    const unique = Array.from(new Set(category.skus.map((s) => s.connectionType)));
    return ['All', ...unique];
  }, [category.skus]);

  const filteredSkus = useMemo(() => {
    if (typeFilter === 'All') return category.skus;
    return category.skus.filter((s) => s.connectionType === typeFilter);
  }, [category.skus, typeFilter]);

  return (
    <div>
      {/* Breadcrumb & Hero Summary */}
      <section className="bg-[#F7F9FB] border-b border-slate-200 py-10 lg:py-16">
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
              className="lg:col-span-7 flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 sm:p-9 shadow-[0_8px_28px_rgba(15,23,42,0.04)]"
              y={16}
            >
              <div>
                <div className="font-mono text-xs font-semibold text-[#0F766E]">
                  {category.indexNumber}. {category.seriesCode} · {category.classification}
                </div>
                <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] text-balance">
                  {category.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-[#475569]">
                  {category.description}
                </p>

                <dl className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-slate-200 py-4 text-xs">
                  <div>
                    <dt className="text-[#64748B]">Wire Range</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                      {category.wireRangeSummary}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#64748B]">Max Current</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                      {category.currentMaxSummary}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#64748B]">Max Voltage</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                      {category.voltageMaxSummary}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#64748B]">Mounting</dt>
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
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-[#F7F9FB] px-5 py-2.5 text-sm font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Request CAD / Datasheet</span>
                </button>
              </div>
            </RevealBlock>

            <GlowCard
              variant="elevated"
              className="lg:col-span-5 p-4 flex items-center justify-center border-slate-200"
            >
              <ImageReveal
                key={category.id}
                direction="center"
                immediate
                className="w-full h-full flex items-center justify-center rounded-md bg-[#EEF2F6] p-3"
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
        </div>
      </section>

      {/* Full Technical Specifications & Interactive Type Filter */}
      <section className="bg-[#EEF2F6] border-b border-slate-200 py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                Technical Cross-Reference
              </p>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[#0F172A]">
                {category.seriesCode} Series Specifications ({filteredSkus.length})
              </h2>
            </div>

            {connectionTypes.length > 2 && (
              <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5">
                {connectionTypes.map((type) => {
                  const active = typeFilter === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeFilter(type)}
                      className={`relative rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'text-white'
                          : 'text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A]'
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
          </RevealBlock>

          <SpecTable
            skus={filteredSkus}
            categoryTitle={category.title}
            torqueColumnLabel={
              category.id === 'spring-cage'
                ? 'Stripping Length'
                : category.id === 'screw-connection' || category.id === 'bolt-connection'
                ? 'Torque / Spec'
                : 'Series Spec'
            }
          />
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
            <h2 className="font-display text-2xl font-bold text-[#0F172A] text-center mb-8">
              Technical Frequently Asked Questions
            </h2>
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
