import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { IMAGES, WHY_CHOOSE_PILLARS } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import {
  GlowCard,
  ImageReveal,
  MagneticButton,
  RevealBlock,
  StaggerGrid,
} from '../components/MotionPrimitives';

export function AboutPage() {
  const { navigate } = useApp();

  return (
    <div>
      <section className="bg-[#F5F7F9] bg-engineering-grid border-b border-[#DCE2E8] py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <RevealBlock className="lg:col-span-6" blur>
            <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
              About TermiCore
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101D2B] text-balance">
              Powering Global Connections
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              TermiCore engineers and manufactures precision DIN-rail terminal blocks and electrical distribution systems for industrial automation, switchgear builders, renewable energy, and process industries.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#101D2B]">
              <span>Global Reach</span>
              <span aria-hidden="true" className="text-[#CBD5E1]">/</span>
              <span>Vertical Integration</span>
              <span aria-hidden="true" className="text-[#CBD5E1]">/</span>
              <span>R&amp;D Focused</span>
            </div>
          </RevealBlock>

          <ImageReveal
            direction="left"
            immediate
            parallax
            className="lg:col-span-6 rounded-lg border border-[#DCE2E8] bg-[#EEF2F6] aspect-[16/9] shadow-xs"
          >
            <EngineeringImage
              src={IMAGES.controlCabinet}
              alt="Precision control cabinet built with TermiCore DIN rail terminal blocks"
              fallbackTitle="TermiCore State-of-the-Art Manufacturing"
              className="h-full w-full object-cover"
            />
          </ImageReveal>
        </div>
      </section>

      <section className="bg-[#EEF2F6] text-[#101D2B] border-b border-[#DCE2E8] py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <RevealBlock className="max-w-2xl mb-10">
            <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
              Engineering Excellence in Every Connection
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#101D2B]">
              Why Professionals Trust TermiCore
            </h2>
          </RevealBlock>

          <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.08} y={18}>
            {[
              {
                title: 'Uncompromising Quality',
                detail:
                  'We use high-grade materials including electrolytic copper and UL 94 V-0 flame-retardant polyamides to ensure maximum safety and longevity.',
              },
              {
                title: 'Innovative Design',
                detail:
                  'From Reakdyn anti-loosening screw yokes to spring-loaded clamps, our engineering team continuously refines connection reliability.',
              },
              {
                title: 'Global Compliance',
                detail:
                  'Our terminal blocks are rigorously tested to meet IEC 60947-7-1, UL 1059, CE, RoHS, and ATEX standards for seamless global panel integration.',
              },
              {
                title: 'Dedicated Support',
                detail:
                  'Our technical specialists provide hands-on guidance, from selecting the right terminal block to providing CAD models and evaluation samples.',
              },
            ].map((item) => (
              <div key={item.title} data-stagger-item className="flex">
                <GlowCard variant="elevated" className="w-full p-6">
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className="h-5 w-5 text-[#0F766E] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#0F172A]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </div>
            ))}
          </StaggerGrid>

          <StaggerGrid
            className="mt-10 grid grid-cols-1 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.07}
            y={14}
          >
            {WHY_CHOOSE_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                data-stagger-item
                className="bg-white p-6 transition-colors hover:bg-[#F7F9FB]"
              >
                <div className="font-mono text-xs font-semibold text-[#0F766E]">
                  {pillar.number}.
                </div>
                <h3 className="mt-2 font-display text-base font-bold text-[#0F172A]">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section className="bg-[#F5F7F9] py-14 lg:py-16">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <GlowCard variant="dark" className="bg-engineering-grid-dark p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-white">
                  Let&apos;s Build Something Reliable Together
                </h2>
                <p className="mt-1.5 text-sm text-[#CBD5E1]">
                  Contact our engineering and sales team for inquiries, custom OEM projects, or bulk pricing.
                </p>
              </div>
              <MagneticButton
                type="button"
                onClick={() => navigate('/contact')}
                className="group inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0F766E] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                <span>Contact TermiCore</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </MagneticButton>
            </div>
          </GlowCard>
        </RevealBlock>
      </section>
    </div>
  );
}
