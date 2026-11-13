import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Layers,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  APPLICATION_SECTORS,
  CERTIFICATIONS,
  HERO_METRICS,
  IMAGES,
  WHY_CHOOSE_PILLARS,
} from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import { ProductCatalogSection } from '../components/ProductCatalogSection';
import { INDUSTRIAL_EASE, RevealBlock } from '../components/MotionPrimitives';

export function HomePage() {
  const { navigate, openDrawer } = useApp();
  const [activeSectorId, setActiveSectorId] = useState(APPLICATION_SECTORS[0].id);

  const activeSector =
    APPLICATION_SECTORS.find((s) => s.id === activeSectorId) ||
    APPLICATION_SECTORS[0];

  return (
    <div>
      {/* 1. LIGHT CANVAS SPLIT HERO WITH DARK NAVY ENGINEERING SPEC PANEL */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            {/* Left Light Canvas Column */}
            <div className="lg:col-span-6 flex flex-col justify-between rounded-lg border border-slate-200 bg-[#F8FAFC] p-7 sm:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
                  Global Manufacturer &amp; Supplier · DIN Rail Connection Systems
                </p>

                <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-950 leading-[1.08] text-balance">
                  Terminal Block Connectors
                </h1>

                <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600">
                  Reliable. Versatile. Built for Performance. Explore our range of precision terminal block connectors engineered for safe, efficient, and long-lasting electrical panel connections.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/products')}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
                  >
                    <Layers className="h-4 w-4" />
                    <span>Explore Products</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
                  >
                    <span>Contact Sales</span>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </motion.button>
                </div>
              </div>

              <div className="mt-10 border-t border-slate-200 pt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600">
                <span>UL 1059 Recognized</span>
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
                <span>IEC 60947-7-1</span>
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
                <span>ISO 9001:2015</span>
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
                <span>CE &amp; RoHS</span>
              </div>
            </div>

            {/* Right Dark Navy Engineering Spec Panel */}
            <div className="lg:col-span-6 flex flex-col justify-between rounded-lg bg-[#0F172A] text-white p-6 sm:p-8 border border-slate-800">
              <div className="overflow-hidden rounded-md border border-slate-800 bg-slate-950 aspect-[16/9]">
                <EngineeringImage
                  src={IMAGES.heroDinRail}
                  alt="TermiCore DIN rail terminal blocks cutaway showing spring and copper busbar engineering"
                  fallbackTitle="TermiCore TS 35 DIN Rail Assembly"
                  darkFallback
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>

              <div className="mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-white">
                      Universal DIN Rail Mounting
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-300">
                      Compatible with TS 35 and G 32 asymmetrical rails for industrial panel building.
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-sky-400 whitespace-nowrap shrink-0">
                    TS 35 / G 32
                  </span>
                </div>

                {/* 4-Cell Tabular Spec Strip */}
                <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {HERO_METRICS.map((metric, idx) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: 0.04 * idx, ease: INDUSTRIAL_EASE }}
                      className="rounded-md border border-slate-800 bg-slate-900/70 p-3.5"
                    >
                      <dt className="text-[11px] font-medium text-slate-400">
                        {metric.label}
                      </dt>
                      <dd className="mt-1 font-mono text-xl font-bold text-white tabular-nums">
                        {metric.value}
                      </dd>
                      <dd className="mt-0.5 text-[11px] text-sky-400">
                        {metric.unit}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCT LINES & EXPANDABLE SPEC MATRIX */}
      <ProductCatalogSection />

      {/* 3. UNIFIED INDUSTRIAL APPLICATIONS SHOWCASE */}
      <section id="applications" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
                Industrial Applications
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
                Engineered for Diverse Industries
              </h2>
              <p className="mt-3 text-base text-slate-600">
                From industrial automation to renewable energy, our terminal block connectors are specified across demanding electrical infrastructure.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1.5">
              {APPLICATION_SECTORS.map((sector) => {
                const isActive = activeSector.id === sector.id;
                return (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => setActiveSectorId(sector.id)}
                    className={`relative rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 hover:bg-white hover:text-slate-950'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="sectorTabIndicator"
                        transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                        className="absolute inset-0 rounded-md bg-[#0F172A]"
                      />
                    )}
                    <span className="relative z-10">{sector.title.split('&')[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSector.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: INDUSTRIAL_EASE }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch rounded-lg border border-slate-200 bg-[#F8FAFC] p-5 sm:p-8"
            >
              <div className="lg:col-span-7 overflow-hidden rounded-md border border-slate-200 bg-slate-900 aspect-[16/9] lg:aspect-auto lg:min-h-[340px]">
                <EngineeringImage
                  src={activeSector.image}
                  alt={activeSector.imageAlt}
                  fallbackTitle={activeSector.title}
                  darkFallback
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#0284C7]">
                    {activeSector.subtitle}
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-slate-950">
                    {activeSector.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {activeSector.summary}
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-slate-200 pt-5">
                    {activeSector.demands.map((demand) => (
                      <li
                        key={demand}
                        className="flex items-start gap-2.5 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                        <span>{demand}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 border-t border-slate-200 pt-5">
                  <div className="text-xs font-semibold text-slate-500 mb-2.5">
                    Recommended Terminal Series
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeSector.recommendedSeries.map((rec) => (
                      <button
                        key={rec.route}
                        type="button"
                        onClick={() => navigate(rec.route)}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 hover:border-[#0284C7] hover:text-[#0284C7] transition-colors cursor-pointer min-h-[38px]"
                      >
                        <span>{rec.label}</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {rec.series}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 4. QUALITY, TESTING & COMPLIANCE STANDARDS MATRIX */}
      <section id="quality" className="bg-[#F8FAFC] border-y border-slate-200 py-16 lg:py-24">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
                Our Commitment
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
                Uncompromising Quality &amp; Global Compliance
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Every terminal block undergoes dielectric, mechanical pull-out, vibration, and thermal cycling checks to satisfy international panel standards.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {[
                  'Rigorous Quality Testing across every production batch',
                  'Electrolytic copper bars & UL 94 V-0 polyamide housings',
                  'Full compliance across IEC, UL, CE, RoHS, and ATEX series',
                  'Built for long-term thermal and mechanical stability',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/quality')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>View Testing &amp; Approvals</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-lg border border-slate-200 bg-white p-5 flex flex-col justify-between transition-colors hover:border-slate-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-bold text-[#0F172A]">
                        {cert.code}
                      </span>
                      <span className="text-slate-500">{cert.verification}</span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-bold text-slate-950">
                      {cert.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {cert.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] font-medium text-[#0284C7]">
                    {cert.scope}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealBlock>
      </section>

      {/* 5. WHY CHOOSE TERMICORE + CONVERSION BAND */}
      <section className="bg-white py-16 lg:py-24">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
              Why Choose TermiCore
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 text-balance">
              Trusted by Professionals Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_PILLARS.map((pillar) => (
              <div key={pillar.number} className="bg-white p-6">
                <div className="font-mono text-xs font-semibold text-[#0284C7]">
                  {pillar.number}.
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-slate-950">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Conversion CTA Band */}
          <div className="mt-12 rounded-lg bg-[#0F172A] px-6 py-10 sm:px-10 sm:py-12 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Let&apos;s Connect
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
                Ready to Power Your Next Project?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300">
                Get in touch with our engineering and sales team for factory-direct quotes, samples, CAD models, or technical support.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/quote')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
              >
                <FileText className="h-4 w-4" />
                <span>Request a Quote</span>
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={openDrawer}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:border-sky-400 transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
              >
                <SlidersHorizontal className="h-4 w-4 text-sky-400" />
                <span>Quick RFQ Drawer</span>
              </motion.button>
            </div>
          </div>
        </RevealBlock>
      </section>
    </div>
  );
}
