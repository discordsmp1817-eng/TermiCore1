import { useState, useMemo } from 'react';
import { Plus, ArrowRight, Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import { ACCESSORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { EngineeringImage } from '../components/EngineeringImage';
import {
  GlowCard,
  MagneticButton,
  RevealBlock,
  StaggerGrid,
} from '../components/MotionPrimitives';

const ACCESSORY_USE_CASE: Record<string, string> = {
  'ep-series': 'Covers exposed terminal sides for safe finger-proof panels',
  'pp-series': 'Separates adjacent circuits needing higher voltage clearance',
  'jumper-series': 'Links adjacent terminal blocks together without extra wires',
  'marker-series': 'Labels wire circuits clearly for fast panel maintenance',
  'din-rails': 'Standard mounting rails for snapping in DIN terminal blocks',
  'test-plugs': 'Safe probe & metering access for CT/PT and test circuits',
  'lug-series': 'Tinned copper ring, fork & pin lugs for heavy-duty stud and feeder wiring',
};

export function AccessoriesPage() {
  const { addToRfq, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(ACCESSORIES.map((a) => a.category)))];
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visible = useMemo(() => {
    return ACCESSORIES.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (!normalizedQuery) return true;

      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.series.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        (ACCESSORY_USE_CASE[item.id] || '').toLowerCase().includes(normalizedQuery) ||
        item.specs.some(
          (s) =>
            s.label.toLowerCase().includes(normalizedQuery) ||
            s.value.toLowerCase().includes(normalizedQuery)
        )
      );
    });
  }, [selectedCategory, normalizedQuery]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <div>
      <section className="bg-[#F5F7F9] bg-engineering-grid border-b border-[#DCE2E8] py-14 lg:py-20">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6" blur>
          <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
            Modular Components
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101D2B] text-balance">
            Terminal Block Accessories
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#475569]">
            Complete installation ecosystem including UL 94 V-0 end plates, high-voltage partition plates, push-in cross jumpers, laser/thermal marker tags, TS 35 / G 32 DIN rails, and CT/PT test plugs.
          </p>

          <div className="mt-8 flex flex-wrap gap-1.5 rounded-lg border border-[#DCE2E8] bg-white p-1.5 w-fit shadow-2xs">
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
                      : 'text-[#475569] hover:bg-[#F5F7F9] hover:text-[#101D2B]'
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

      <section className="bg-[#EEF2F6] px-4 sm:px-6 py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] rounded-xl border border-[#DCE2E8] bg-white p-5 sm:p-8 lg:p-10 shadow-[0_14px_40px_rgba(16,29,43,0.05)]">
          {/* Easy Accessory Finder Bar */}
          <div className="mb-8 rounded-lg border border-slate-200 bg-[#F7F9FB] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <label htmlFor="accessory-finder-input" className="sr-only">
                Search accessories by name, series, or use case
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                id="accessory-finder-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find accessories by name, part series, or need (e.g. DIN rail, Jumper, End Plate, 41 A)..."
                className="w-full rounded-md border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0F766E] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear accessory search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs text-[#475569]">
              <span className="font-medium">
                Showing <strong className="text-[#0F172A]">{visible.length}</strong> of{' '}
                {ACCESSORIES.length} accessories
              </span>
              {(selectedCategory !== 'All' || searchQuery.trim()) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-[#F7F9FB] px-2.5 py-1.5 font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {visible.length > 0 ? (
            <StaggerGrid
              key={`${selectedCategory}-${normalizedQuery}`}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              stagger={0.07}
              y={18}
            >
              {visible.map((item) => (
                <div key={item.id} data-stagger-item className="flex">
                  <GlowCard
                    as="article"
                    variant="light"
                    className="group w-full p-6 bg-[#F7F9FB] hover:-translate-y-1"
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-semibold text-[#0F766E]">
                            {item.series}
                          </span>
                          <span className="text-[#64748B]">{item.category}</span>
                        </div>

                        <div className="mt-3.5 overflow-hidden rounded-md border border-slate-200 bg-white aspect-[4/3]">
                          <EngineeringImage
                            src={item.image}
                            alt={item.imageAlt}
                            fallbackTitle={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                          />
                        </div>

                        <h2 className="mt-4 font-display text-xl font-bold text-[#0F172A]">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                          {ACCESSORY_USE_CASE[item.id] || item.description}
                        </p>

                        <dl className="mt-5 grid grid-cols-2 gap-3 rounded-md border border-slate-200/80 bg-white p-3 text-xs">
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
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                No Accessories Matched Your Filter
              </h2>
              <p className="mt-1.5 text-sm text-[#475569]">
                Clear your search or switch back to all categories to view every TermiCore accessory.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
              >
                <span>Show All Accessories</span>
              </button>
            </div>
          )}

          <RevealBlock className="mt-12">
            <GlowCard variant="dark" className="bg-engineering-grid-dark p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-white">
                    Need Bulk Accessories for Your Panel Build?
                  </h2>
                  <p className="mt-1.5 text-sm text-[#CBD5E1]">
                    Submit your BOM or request matched end plates and cross jumpers alongside your terminal block order.
                  </p>
                </div>
                <MagneticButton
                  type="button"
                  onClick={() => navigate('/quote')}
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0F766E] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
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
