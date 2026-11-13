import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CERTIFICATIONS, TESTING_PROTOCOLS, IMAGES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import { RevealBlock } from '../components/MotionPrimitives';

export function QualityPage() {
  const { navigate } = useApp();

  return (
    <div>
      <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
              Quality &amp; Approvals
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 text-balance">
              Uncompromising Quality &amp; Safety
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Every TermiCore terminal block undergoes rigorous testing for thermal stability, mechanical retention, and dielectric insulation to meet international electrical engineering standards.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-700">
              <span>Dielectric Tested</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Vibration Proof</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Thermal Cycling</span>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <span>Zero Defect Manufacturing</span>
            </div>
          </div>

          <div className="lg:col-span-5 overflow-hidden rounded-lg border border-slate-200 bg-[#0F172A] aspect-[16/9]">
            <EngineeringImage
              src={IMAGES.heroDinRail}
              alt="TermiCore cutaway terminal block quality inspection"
              fallbackTitle="TermiCore Quality Engineering"
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
              Certifications &amp; Approvals
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-950">
              International Compliance Matrix
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className="rounded-lg border border-slate-200 bg-white p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#0284C7]">
                      {cert.code}
                    </span>
                    <span className="text-slate-500">{cert.verification}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-slate-950">
                    {cert.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {cert.description}
                  </p>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-medium text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#0284C7]" />
                  <span>{cert.scope}</span>
                </div>
              </div>
            ))}
          </div>
        </RevealBlock>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
                Rigorous Testing Protocol
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-950">
                Material Excellence &amp; Batch Verification
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                High-conductivity electrolytic copper current bars and UL 94 V-0 polyamide housings ensure dependable operation inside high-density industrial enclosures.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TESTING_PROTOCOLS.map((protocol) => (
                <div
                  key={protocol.title}
                  className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-5"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#0284C7]" />
                  <h3 className="mt-3 font-display text-base font-bold text-slate-950">
                    {protocol.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {protocol.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-lg bg-[#0F172A] p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Need Compliance Documents or Test Reports?
              </h2>
              <p className="mt-1.5 text-sm text-slate-300">
                Contact our technical team to request UL certificates, RoHS declarations, or CAD models for your project.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
            >
              <span>Request Documents</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </RevealBlock>
      </section>
    </div>
  );
}
