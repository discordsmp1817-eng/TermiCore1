import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CERTIFICATIONS, TESTING_PROTOCOLS, IMAGES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import {
  GlowCard,
  ImageReveal,
  MagneticButton,
  RevealBlock,
  StaggerGrid,
} from '../components/MotionPrimitives';

export function QualityPage() {
  const { navigate } = useApp();

  return (
    <div>
      <section className="bg-[#F7F9FB] border-b border-slate-200 py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <RevealBlock className="lg:col-span-7" blur>
            <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
              Quality &amp; Approvals
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] text-balance">
              Uncompromising Quality &amp; Safety
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
              Every TermiCore terminal block undergoes rigorous testing for thermal stability, mechanical retention, and dielectric insulation to meet international electrical engineering standards.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#0F172A]">
              <span>Dielectric Tested</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Vibration Proof</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Thermal Cycling</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Zero Defect Manufacturing</span>
            </div>
          </RevealBlock>

          <ImageReveal
            direction="right"
            immediate
            className="lg:col-span-5 rounded-lg border border-slate-200 bg-[#EEF2F6] aspect-[16/9]"
          >
            <EngineeringImage
              src={IMAGES.heroDinRail}
              alt="TermiCore cutaway terminal block quality inspection"
              fallbackTitle="TermiCore Quality Engineering"
              className="h-full w-full object-cover"
            />
          </ImageReveal>
        </div>
      </section>

      <section className="bg-[#EEF2F6] border-b border-slate-200 py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <RevealBlock className="max-w-2xl mb-10">
            <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
              Certifications &amp; Approvals
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0F172A]">
              International Compliance Matrix
            </h2>
          </RevealBlock>

          <StaggerGrid
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            stagger={0.07}
            y={18}
          >
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.id} data-stagger-item className="flex">
                <GlowCard variant="elevated" className="w-full p-6 hover:-translate-y-0.5">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#0F766E]">
                          {cert.code}
                        </span>
                        <span className="text-[#64748B]">{cert.verification}</span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-bold text-[#0F172A]">
                        {cert.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                        {cert.description}
                      </p>
                    </div>
                    <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-medium text-[#0F172A] flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#0F766E]" />
                      <span>{cert.scope}</span>
                    </div>
                  </div>
                </GlowCard>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <RevealBlock className="lg:col-span-5">
              <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                Rigorous Testing Protocol
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0F172A]">
                Material Excellence &amp; Batch Verification
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                High-conductivity electrolytic copper current bars and UL 94 V-0 polyamide housings ensure dependable operation inside high-density industrial enclosures.
              </p>
            </RevealBlock>
            <StaggerGrid
              className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
              stagger={0.08}
              y={16}
            >
              {TESTING_PROTOCOLS.map((protocol) => (
                <div key={protocol.title} data-stagger-item className="flex">
                  <GlowCard variant="light" className="w-full p-5">
                    <CheckCircle2 className="h-5 w-5 text-[#0F766E]" />
                    <h3 className="mt-3 font-display text-base font-bold text-[#0F172A]">
                      {protocol.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                      {protocol.detail}
                    </p>
                  </GlowCard>
                </div>
              ))}
            </StaggerGrid>
          </div>

          <RevealBlock className="mt-12">
            <GlowCard variant="light" className="border-slate-200 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#0F172A]">
                    Need Compliance Documents or Test Reports?
                  </h2>
                  <p className="mt-1.5 text-sm text-[#475569]">
                    Contact our technical team to request UL certificates, RoHS declarations, or CAD models for your project.
                  </p>
                </div>
                <MagneticButton
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                >
                  <span>Request Documents</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </MagneticButton>
              </div>
            </GlowCard>
          </RevealBlock>
        </div>
      </section>
    </div>
  );
}
