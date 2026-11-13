import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, CheckCircle2, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCategory, ACCESSORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import { SpecTable } from '../components/SpecTable';
import { INDUSTRIAL_EASE, RevealBlock } from '../components/MotionPrimitives';

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
      <section className="bg-white border-b border-slate-200 py-10 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0284C7] transition-colors cursor-pointer mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Products</span>
          </button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between rounded-lg border border-slate-200 bg-[#F8FAFC] p-6 sm:p-9">
              <div>
                <div className="font-mono text-xs font-semibold text-[#0284C7]">
                  {category.indexNumber}. {category.seriesCode} · {category.classification}
                </div>
                <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
                  {category.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {category.description}
                </p>

                <dl className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-slate-200 py-4 text-xs">
                  <div>
                    <dt className="text-slate-500">Wire Range</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-slate-950 tabular-nums">
                      {category.wireRangeSummary}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Max Current</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-slate-950 tabular-nums">
                      {category.currentMaxSummary}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Max Voltage</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-slate-950 tabular-nums">
                      {category.voltageMaxSummary}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Mounting</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-slate-950">
                      {category.railCompatibility}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
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
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors cursor-pointer min-h-[44px]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Series to RFQ</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Request CAD / Datasheet</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 overflow-hidden rounded-lg border border-slate-200 bg-[#F8FAFC] flex items-center justify-center p-4">
              <EngineeringImage
                src={category.image}
                alt={category.imageAlt}
                fallbackTitle={category.title}
                className="h-full w-full max-h-[340px] object-contain rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Full Technical Specifications & Interactive Type Filter */}
      <section className="bg-[#F8FAFC] border-b border-slate-200 py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
                Technical Cross-Reference
              </p>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-slate-950">
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
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId={`categoryTypeFilter-${category.id}`}
                          transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                          className="absolute inset-0 rounded-md bg-[#0F172A]"
                        />
                      )}
                      <span className="relative z-10">{type}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

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
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
                Engineering Mechanism
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-950 text-balance">
                {category.principleTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {category.principleSummary}
              </p>

              <div className="mt-6 space-y-4">
                {category.principlePoints.map((pt) => (
                  <div
                    key={pt.title}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-[#F8FAFC] p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-950">
                        {pt.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {pt.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              {category.steps && (
                <div className="rounded-lg bg-[#0F172A] p-6 sm:p-8 text-white">
                  <h3 className="font-display text-lg font-bold">
                    3-Step Conductor Termination
                  </h3>
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {category.steps.map((s) => (
                      <div
                        key={s.step}
                        className="rounded-md border border-slate-800 bg-slate-900 p-4"
                      >
                        <div className="font-mono text-xs font-bold text-sky-400">
                          Step 0{s.step}
                        </div>
                        <h4 className="mt-1.5 font-display text-sm font-bold text-white">
                          {s.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-slate-300">
                          {s.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Essential Accessories Strip */}
              <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="font-display text-base font-bold text-slate-950">
                    Compatible Mounting &amp; Bridging Accessories
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigate('/accessories')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer"
                  >
                    <span>All Accessories</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACCESSORIES.slice(0, 4).map((acc) => (
                    <div
                      key={acc.id}
                      className="rounded-md border border-slate-200 bg-white p-3.5"
                    >
                      <div className="font-mono text-[11px] font-semibold text-[#0284C7]">
                        {acc.series}
                      </div>
                      <div className="mt-0.5 text-sm font-bold text-slate-950">
                        {acc.title}
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{acc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealBlock>
      </section>

      {/* Technical FAQs */}
      {category.faqs.length > 0 && (
        <section className="bg-[#F8FAFC] py-14 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-slate-950 text-center mb-8">
              Technical Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {category.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.question}
                    className="rounded-lg border border-slate-200 bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-display text-sm sm:text-base font-semibold text-slate-950 hover:bg-slate-50 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.16, ease: INDUSTRIAL_EASE }}
                          className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
