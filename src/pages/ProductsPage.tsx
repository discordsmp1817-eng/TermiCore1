import { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRODUCT_CATEGORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import { ProductCatalogSection } from '../components/ProductCatalogSection';
import { SpecTable } from '../components/SpecTable';
import {
  GlowCard,
  INDUSTRIAL_EASE,
  MagneticButton,
  RevealBlock,
} from '../components/MotionPrimitives';

export function ProductsPage() {
  const { navigate } = useApp();
  const [query, setQuery] = useState('');

  const allSkus = useMemo(
    () =>
      PRODUCT_CATEGORIES.flatMap((cat) =>
        cat.skus.map((sku) => ({ ...sku, categoryTitle: cat.title }))
      ),
    []
  );

  const filteredSkus = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allSkus.filter(
      (s) =>
        s.model.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.connectionType.toLowerCase().includes(q) ||
        s.wireRangeIec.toLowerCase().includes(q) ||
        s.currentRating.toLowerCase().includes(q) ||
        s.categoryTitle.toLowerCase().includes(q)
    );
  }, [allSkus, query]);

  return (
    <div>
      <section className="bg-[#F7F9FB] border-b border-slate-200 py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <RevealBlock
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
            blur
          >
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
                Product Catalog
              </p>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] text-balance">
                Terminal Block Connector Solutions
              </h1>
              <p className="mt-4 text-base text-[#475569]">
                Complete portfolio of DIN-rail and busbar terminal blocks from 0.2 mm² control wiring up to 120 mm² / 300 A heavy power feeders.
              </p>
            </div>

            {/* Cross-Series SKU Search */}
            <div className="w-full lg:w-96">
              <label
                htmlFor="catalog-sku-search"
                className="block text-xs font-semibold text-[#0F172A] mb-1.5"
              >
                Quick Part &amp; Rating Lookup
              </label>
              <div className="relative group">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] group-focus-within:text-[#0F766E] transition-colors" />
                <input
                  id="catalog-sku-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search TSC 4, 150 A, Disconnect, TNC..."
                  className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0F766E] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </RevealBlock>

          <AnimatePresence>
            {query.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: INDUSTRIAL_EASE }}
                className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base font-bold text-[#0F172A]">
                    Matching Models ({filteredSkus.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="text-xs font-semibold text-[#0F766E] hover:text-[#0D9488] transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
                {filteredSkus.length > 0 ? (
                  <SpecTable skus={filteredSkus} categoryTitle="Catalog Search" />
                ) : (
                  <p className="text-sm text-[#475569]">
                    No terminal block SKUs matched &ldquo;{query}&rdquo;. Try searching by series prefix (TSC, TSC-R, TSS, TBC, TNC) or rated current (32 A, 150 A).
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ProductCatalogSection compactHeading />

      <section className="bg-[#F7F9FB] py-14 border-b border-slate-200">
        <RevealBlock className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <GlowCard variant="elevated" className="p-8 border-slate-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0F172A]">
                  Need a Custom Solution or Complete Accessory Kit?
                </h2>
                <p className="mt-1.5 text-sm text-[#475569]">
                  Pair your terminal blocks with TermiCore end plates, partition plates, insulated cross jumpers, and TS 35 DIN rails.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/accessories')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-[#F7F9FB] px-5 py-2.5 text-sm font-semibold text-[#0F172A] hover:border-[#0F766E] hover:text-[#0F766E] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Browse Accessories</span>
                </button>
                <MagneticButton
                  type="button"
                  onClick={() => navigate('/quote')}
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </MagneticButton>
              </div>
            </div>
          </GlowCard>
        </RevealBlock>
      </section>
    </div>
  );
}
