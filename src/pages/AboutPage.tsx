import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { IMAGES, WHY_CHOOSE_PILLARS } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import { RevealBlock } from '../components/MotionPrimitives';

export function AboutPage() {
  const { navigate } = useApp();

  return (
    <div>
      <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
              About TermiCore
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 text-balance">
              Powering Global Connections
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              TermiCore engineers and manufactures precision DIN-rail terminal blocks and electrical distribution systems for industrial automation, switchgear builders, renewable energy, and process industries.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-700">
              <span>Global Reach</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Vertical Integration</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>R&amp;D Focused</span>
            </div>
          </div>

          <div className="lg:col-span-6 overflow-hidden rounded-lg border border-slate-200 bg-slate-900 aspect-[16/9]">
            <EngineeringImage
              src={IMAGES.controlCabinet}
              alt="Precision control cabinet built with TermiCore DIN rail terminal blocks"
              fallbackTitle="TermiCore State-of-the-Art Manufacturing"
              darkFallback
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] border-b border-slate-200 py-14 lg:py-20">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
              Engineering Excellence in Every Connection
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-950">
              Why Professionals Trust TermiCore
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <div
                key={item.title}
                className="rounded-lg border border-slate-200 bg-white p-6 flex items-start gap-3.5"
              >
                <CheckCircle2 className="h-5 w-5 text-[#0284C7] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_PILLARS.map((pillar) => (
              <div key={pillar.number} className="bg-white p-6">
                <div className="font-mono text-xs font-semibold text-[#0284C7]">
                  {pillar.number}.
                </div>
                <h3 className="mt-2 font-display text-base font-bold text-slate-950">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </RevealBlock>
      </section>

      <section className="bg-white py-14">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6 rounded-lg bg-[#0F172A] p-8 sm:p-10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Let&apos;s Build Something Reliable Together
            </h2>
            <p className="mt-1.5 text-sm text-slate-300">
              Contact our engineering and sales team for inquiries, custom OEM projects, or bulk pricing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
          >
            <span>Contact TermiCore</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </RevealBlock>
      </section>
    </div>
  );
}
