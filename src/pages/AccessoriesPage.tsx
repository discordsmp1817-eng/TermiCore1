import { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ACCESSORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import {
  GlowCard,
  MagneticButton,
  RevealBlock,
  StaggerGrid,
} from '../components/MotionPrimitives';

export function AccessoriesPage() {
  const { addToRfq, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(ACCESSORIES.map((a) => a.category)))];
  const visible =
    selectedCategory === 'All'
      ? ACCESSORIES
      : ACCESSORIES.filter((a) => a.category === selectedCategory);

  return (
    <div>
      <section className="bg-[#F7F9FB] border-b border-slate-200 py-12 lg:py-16">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6" blur>
          <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
            Modular Components
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] text-balance">
            Terminal Block Accessories
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#475569]">
            Complete installation ecosystem including UL 94 V-0 end plates, high-voltage partition plates, push-in cross jumpers, laser/thermal marker tags, TS 35 / G 32 DIN rails, and CT/PT test plugs.
          </p>

          <div className="mt-8 flex flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 w-fit">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative rounded-md px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer min-h-[38px] ${
                    active
                      ? 'text-white'
                      : 'text-[#475569] hover:bg-[#F7F9FB] hover:text-[#0F172A]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="accessoryFilterPill"
                      transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                      className="absolute inset-0 rounded-md bg-[#0F766E]"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </RevealBlock>
      </section>

      <section className="bg-[#EEF2F6] py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <StaggerGrid
            key={selectedCategory}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            stagger={0.07}
            y={18}
          >
            {visible.map((item) => (
              <div key={item.id} data-stagger-item className="flex">
                <GlowCard
                  as="article"
                  variant="elevated"
                  className="w-full p-6 hover:-translate-y-1"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold text-[#0F766E]">
                          {item.series}
                        </span>
                        <span className="text-[#64748B]">{item.category}</span>
                      </div>
                      <h2 className="mt-3 font-display text-xl font-bold text-[#0F172A]">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                        {item.description}
                      </p>

                      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
                        {item.specs.map((sp) => (
                          <div key={sp.label}>
                            <dt className="text-[#64748B]">{sp.label}</dt>
                            <dd className="mt-0.5 font-mono font-semibold text-[#0F172A]">
                              {sp.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="mt-6 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          addToRfq({
                            id: item.series,
                            model: item.series,
                            title: item.title,
                            category: 'Accessory',
                            specSummary: item.specs.map((s) => s.value).join(' · '),
                          })
                        }
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer min-h-[40px]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Accessory to RFQ</span>
                      </button>
                    </div>
                  </div>
                </GlowCard>
              </div>
            ))}
          </StaggerGrid>

          <RevealBlock className="mt-12">
            <GlowCard variant="elevated" className="border-slate-200 bg-white p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#0F172A]">
                    Need Bulk Accessories for Your Panel Build?
                  </h2>
                  <p className="mt-1.5 text-sm text-[#475569]">
                    Submit your BOM or request matched end plates and cross jumpers alongside your terminal block order.
                  </p>
                </div>
                <MagneticButton
                  type="button"
                  onClick={() => navigate('/quote')}
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                >
                  <span>Request Bulk Quote</span>
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
