import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Layers,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
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
import {
  CountUpMetric,
  GlowCard,
  INDUSTRIAL_EASE,
  ImageReveal,
  MagneticButton,
  RevealBlock,
  StaggerGrid,
  usePrefersReducedMotion,
} from '../components/MotionPrimitives';

export function HomePage() {
  const { navigate, openDrawer } = useApp();
  const [activeSectorId, setActiveSectorId] = useState(APPLICATION_SECTORS[0].id);
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const activeSector =
    APPLICATION_SECTORS.find((s) => s.id === activeSectorId) ||
    APPLICATION_SECTORS[0];

  useEffect(() => {
    const el = heroRef.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('[data-hero-kicker]', {
        y: 14,
        opacity: 0,
        duration: 0.55,
        clearProps: 'transform,opacity',
      })
        .from(
          '[data-hero-word]',
          {
            yPercent: 108,
            opacity: 0,
            duration: 0.72,
            stagger: 0.09,
            clearProps: 'transform,opacity',
          },
          '-=0.35'
        )
        .from(
          '[data-hero-sub]',
          {
            y: 16,
            opacity: 0,
            filter: 'blur(4px)',
            duration: 0.6,
            clearProps: 'transform,opacity,filter',
          },
          '-=0.45'
        )
        .from(
          '[data-hero-cta]',
          {
            y: 14,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            clearProps: 'transform,opacity',
          },
          '-=0.38'
        )
        .from(
          '[data-hero-std]',
          {
            y: 10,
            opacity: 0,
            duration: 0.45,
            stagger: 0.05,
            clearProps: 'transform,opacity',
          },
          '-=0.3'
        );

      gsap.to('[data-hero-float]', {
        y: -4,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const headlineWords = ['Terminal', 'Block', 'Connectors'];

  return (
    <div>
      {/* 1. ARCHITECTURAL LIGHT SPLIT HERO */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-[#F7F9FB] py-12 sm:py-16 lg:py-20"
      >
        {/* Subtle ambient teal daylight halo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[8%] h-[420px] w-[420px] rounded-full opacity-25 blur-[110px]"
          style={{
            background:
              'radial-gradient(circle, rgba(13,148,136,0.22) 0%, rgba(15,118,110,0.06) 55%, transparent 75%)',
          }}
        />

        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            {/* Left Light Editorial Column */}
            <div className="lg:col-span-6 flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-7 sm:p-10 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div>
                <p
                  data-hero-kicker
                  className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]"
                >
                  Global Manufacturer &amp; Supplier · DIN Rail Connection Systems
                </p>

                <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-[#0F172A] leading-[1.08] text-balance">
                  {headlineWords.map((word) => (
                    <span
                      key={word}
                      className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0 pb-1"
                    >
                      <span data-hero-word className="inline-block">
                        {word}
                      </span>
                    </span>
                  ))}
                </h1>

                <p
                  data-hero-sub
                  className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#475569]"
                >
                  Reliable. Versatile. Built for Performance. Explore our range of precision terminal block connectors engineered for safe, efficient, and long-lasting electrical panel connections.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <div data-hero-cta>
                    <MagneticButton
                      type="button"
                      onClick={() => navigate('/products')}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
                    >
                      <Layers className="h-4 w-4" />
                      <span>Explore Products</span>
                    </MagneticButton>
                  </div>
                  <div data-hero-cta>
                    <MagneticButton
                      type="button"
                      onClick={() => navigate('/contact')}
                      className="group inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-[#F7F9FB] px-6 py-3 text-sm font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
                    >
                      <span>Contact Sales</span>
                      <ArrowRight className="h-4 w-4 text-[#0F766E] transition-transform duration-200 group-hover:translate-x-1" />
                    </MagneticButton>
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-slate-200 pt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#475569]">
                <span data-hero-std>UL 1059 Recognized</span>
                <span data-hero-std aria-hidden="true" className="text-slate-300">
                  /
                </span>
                <span data-hero-std>IEC 60947-7-1</span>
                <span data-hero-std aria-hidden="true" className="text-slate-300">
                  /
                </span>
                <span data-hero-std>ISO 9001:2015</span>
                <span data-hero-std aria-hidden="true" className="text-slate-300">
                  /
                </span>
                <span data-hero-std>CE &amp; RoHS</span>
              </div>
            </div>

            {/* Right Light Engineering Spec Card */}
            <GlowCard
              variant="elevated"
              className="lg:col-span-6 p-6 sm:p-8 border-slate-200"
            >
              <div className="relative flex flex-col justify-between h-full">
                <ImageReveal
                  direction="right"
                  immediate
                  delay={0.12}
                  className="relative rounded-md border border-slate-200 bg-[#EEF2F6] aspect-[16/9]"
                >
                  <EngineeringImage
                    src={IMAGES.heroDinRail}
                    alt="TermiCore DIN rail terminal blocks cutaway showing spring and copper busbar engineering"
                    fallbackTitle="TermiCore TS 35 DIN Rail Assembly"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </ImageReveal>

                <div className="mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-[#0F172A]">
                        Universal DIN Rail Mounting
                      </h2>
                      <p className="mt-0.5 text-sm text-[#475569]">
                        Compatible with TS 35 and G 32 asymmetrical rails for industrial panel building.
                      </p>
                    </div>
                    <span
                      data-hero-float
                      className="font-mono text-xs font-semibold text-[#0F766E] whitespace-nowrap shrink-0"
                    >
                      TS 35 / G 32
                    </span>
                  </div>

                  {/* 4-Cell Tabular Spec Strip */}
                  <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {HERO_METRICS.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-md border border-slate-200 bg-[#F7F9FB] p-3.5 transition-colors duration-200 hover:border-[#0F766E]/45"
                      >
                        <dt className="text-[11px] font-medium text-[#64748B]">
                          {metric.label}
                        </dt>
                        <dd className="mt-1 font-mono text-xl font-bold text-[#0F172A] tabular-nums">
                          <CountUpMetric value={metric.value} />
                        </dd>
                        <dd className="mt-0.5 font-mono text-[11px] text-[#0F766E]">
                          {metric.unit}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE PRODUCT LINES & EXPANDABLE SPEC MATRIX */}
      <ProductCatalogSection />

      {/* 3. UNIFIED INDUSTRIAL APPLICATIONS SHOWCASE */}
      <section id="applications" className="bg-white text-[#0F172A] py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                Industrial Applications
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] text-balance">
                Engineered for Diverse Industries
              </h2>
              <p className="mt-3 text-base text-[#475569]">
                From industrial automation to renewable energy, our terminal block connectors are specified across demanding electrical infrastructure.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-[#EEF2F6] p-1.5">
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
                        : 'text-[#475569] hover:bg-white hover:text-[#0F172A]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="sectorTabIndicator"
                        transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                        className="absolute inset-0 rounded-md bg-[#0F766E]"
                      />
                    )}
                    <span className="relative z-10">{sector.title.split('&')[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </RevealBlock>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSector.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: INDUSTRIAL_EASE }}
            >
              <GlowCard variant="light" className="p-5 sm:p-8 border-slate-200">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
                  <ImageReveal
                    key={activeSector.image}
                    direction="left"
                    immediate
                    className="lg:col-span-7 rounded-md border border-slate-200 bg-[#EEF2F6] aspect-[16/9] lg:aspect-auto lg:min-h-[340px]"
                  >
                    <EngineeringImage
                      src={activeSector.image}
                      alt={activeSector.imageAlt}
                      fallbackTitle={activeSector.title}
                      className="h-full w-full object-cover"
                    />
                  </ImageReveal>

                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <div className="font-mono text-xs font-semibold text-[#0F766E]">
                        {activeSector.subtitle}
                      </div>
                      <h3 className="mt-2 font-display text-2xl font-bold text-[#0F172A]">
                        {activeSector.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                        {activeSector.summary}
                      </p>

                      <ul className="mt-5 space-y-2.5 border-t border-slate-200 pt-5">
                        {activeSector.demands.map((demand) => (
                          <li
                            key={demand}
                            className="flex items-start gap-2.5 text-sm text-[#0F172A]"
                          >
                            <CheckCircle2 className="h-4 w-4 text-[#0F766E] shrink-0 mt-0.5" />
                            <span>{demand}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7 border-t border-slate-200 pt-5">
                      <div className="text-xs font-semibold text-[#64748B] mb-2.5">
                        Recommended Terminal Series
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeSector.recommendedSeries.map((rec) => (
                          <button
                            key={rec.route}
                            type="button"
                            onClick={() => navigate(rec.route)}
                            className="group inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer min-h-[38px]"
                          >
                            <span>{rec.label}</span>
                            <span className="font-mono text-[11px] text-[#64748B]">
                              {rec.series}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 4. QUALITY, TESTING & COMPLIANCE STANDARDS MATRIX */}
      <section
        id="quality"
        className="bg-[#EEF2F6] border-y border-slate-200 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <RevealBlock className="lg:col-span-5" blur>
              <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                Our Commitment
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] text-balance">
                Uncompromising Quality &amp; Global Compliance
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#475569]">
                Every terminal block undergoes dielectric, mechanical pull-out, vibration, and thermal cycling checks to satisfy international panel standards.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-[#0F172A]">
                {[
                  'Rigorous Quality Testing across every production batch',
                  'Electrolytic copper bars & UL 94 V-0 polyamide housings',
                  'Full compliance across IEC, UL, CE, RoHS, and ATEX series',
                  'Built for long-term thermal and mechanical stability',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-[#0F766E] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticButton
                  type="button"
                  onClick={() => navigate('/quality')}
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>View Testing &amp; Approvals</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </MagneticButton>
              </div>
            </RevealBlock>

            <StaggerGrid
              className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
              stagger={0.07}
              y={20}
            >
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.id} data-stagger-item className="flex">
                  <GlowCard variant="elevated" className="w-full p-5 hover:-translate-y-0.5">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-mono font-bold text-[#0F766E]">
                            {cert.code}
                          </span>
                          <span className="text-[#64748B]">{cert.verification}</span>
                        </div>
                        <h3 className="mt-2 font-display text-base font-bold text-[#0F172A]">
                          {cert.title}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                          {cert.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] font-medium text-[#0F766E]">
                        {cert.scope}
                      </div>
                    </div>
                  </GlowCard>
                </div>
              ))}
            </StaggerGrid>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE TERMICORE + CONVERSION BAND */}
      <section className="bg-[#F7F9FB] py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <RevealBlock className="max-w-2xl mb-10">
            <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
              Why Choose TermiCore
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] text-balance">
              Trusted by Professionals Worldwide
            </h2>
          </RevealBlock>

          <StaggerGrid
            className="grid grid-cols-1 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.07}
            y={18}
          >
            {WHY_CHOOSE_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                data-stagger-item
                className="bg-white p-6 transition-colors duration-200 hover:bg-[#F7F9FB]"
              >
                <div className="font-mono text-xs font-semibold text-[#0F766E]">
                  {pillar.number}.
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-[#0F172A]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </StaggerGrid>

          {/* Conversion CTA Band */}
          <RevealBlock className="mt-12">
            <GlowCard
              variant="elevated"
              className="border-slate-200 bg-white px-6 py-10 sm:px-10 sm:py-12"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                    Let&apos;s Connect
                  </p>
                  <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] text-balance">
                    Ready to Power Your Next Project?
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-[#475569]">
                    Get in touch with our engineering and sales team for factory-direct quotes, samples, CAD models, or technical support.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <MagneticButton
                    type="button"
                    onClick={() => navigate('/quote')}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Request a Quote</span>
                  </MagneticButton>
                  <MagneticButton
                    type="button"
                    onClick={openDrawer}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-[#F7F9FB] px-5 py-3 text-sm font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors whitespace-nowrap cursor-pointer min-h-[44px]"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-[#0F766E]" />
                    <span>Quick RFQ Drawer</span>
                  </MagneticButton>
                </div>
              </div>
            </GlowCard>
          </RevealBlock>
        </div>
      </section>
    </div>
  );
}
